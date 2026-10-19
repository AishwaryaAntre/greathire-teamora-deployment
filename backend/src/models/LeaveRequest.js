import { leaveRequests, persistNewLeaveRequest, persistLeaveRequestUpdate, deleteLeaveRequestsByEmployeeId } from "../data/leaveStore.js";
import { Employee } from "./Employee.js";
import { generateId } from "../utils/id.js";
import { todayISO, isSameMonth, isLastMonth, daysBetweenInclusive } from "../utils/dates.js";
import { paginate } from "../utils/paginate.js";
import { Notification } from "./Notification.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";
function withEmployee(request) {
  let employee = Employee.getById(request.employeeId);
  return { ...request, employee };
}

export let LeaveRequest = {
  /** Full (unpaginated) filtered list — used by CSV export and internally by list(). */
  getAll({ status, period, search, employeeId } = {}) {
    let rows = leaveRequests;

    if (employeeId) {
      rows = rows.filter((r) => r.employeeId === employeeId);
    }
    if (status && status !== "All") {
      rows = rows.filter((r) => r.status === status);
    }
    if (period === "This Month") {
      rows = rows.filter((r) => isSameMonth(r.startDate));
    } else if (period === "Last Month") {
      rows = rows.filter((r) => isLastMonth(r.startDate));
    }
    if (search) {
      let q = search.toLowerCase();
      rows = rows.filter((r) => Employee.getById(r.employeeId)?.name.toLowerCase().includes(q));
    }

    return rows
      .map(withEmployee)
      .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
  },

  /** Paginated version of getAll(), for the GET /requests list endpoint. */
  list({ status, period, search, employeeId, page = 1, pageSize = 100 } = {}) {
    let rows = this.getAll({ status, period, search, employeeId });
    return paginate(rows, { page, pageSize });
  },

  getById(id) {
    let request = leaveRequests.find((r) => r.id === id);
    return request ? withEmployee(request) : null;
  },

  /** Maps to the Leave Management StatsCards row: Pending / Approved Today / On Leave Today. */
  
getStatsCards() {
  const today = todayISO();

  const pending = leaveRequests.filter(
    (r) => r.status === "Pending"
  ).length;

  const approvedToday = leaveRequests.filter(
    (r) => r.status === "Approved" && r.decidedOn === today
  ).length;

  // Count unique employees who have approved leave today.
  const onLeaveTodayIds = new Set(
    leaveRequests
      .filter(
        (r) =>
          r.status === "Approved" &&
          r.startDate <= today &&
          r.endDate >= today
      )
      .map((r) => r.employeeId)
  );

  return [
    {
      key: "pending",
      tag: "Pending",
      label: "Pending Requests",
      value: String(pending),
    },
    {
      key: "approvedToday",
      tag: "Today",
      label: "Approved Today",
      value: String(approvedToday),
    },
    {
      key: "onLeaveToday",
      tag: "Active",
      label: "On Leave Today",
      value: String(onLeaveTodayIds.size),
    },
  ];
},


  /** Maps to the "Team Availability (Today)" panel. */
  getTeamAvailability() {
    let today = todayISO();
    let totalEmployees = Employee.getAll().length;

    let onLeaveIds = new Set(
      leaveRequests
        .filter((r) => r.status === "Approved" && r.startDate <= today && r.endDate >= today)
        .map((r) => r.employeeId)
    );
    let onSickLeaveIds = new Set(
      leaveRequests
        .filter(
          (r) =>
            r.status === "Approved" &&
            r.leaveType === "Sick Leave" &&
            r.startDate <= today &&
            r.endDate >= today
        )
        .map((r) => r.employeeId)
    );

    let onLeave = onLeaveIds.size;
    let sick = onSickLeaveIds.size;
    let working = Math.max(totalEmployees - onLeave, 0);

    return [
      { key: "working", label: "Working", value: String(working), dotColor: "bg-emerald-500" },
      { key: "onLeave", label: "On Leave", value: String(onLeave - sick), dotColor: "bg-amber-500" },
      { key: "sickLeave", label: "Sick Leave", value: String(sick), dotColor: "bg-red-500" },
    ];
  },

  async create({ employeeId, leaveType, startDate, endDate, reason }) {
    let employee = Employee.getById(employeeId);
    if (!employee) throw new Error("Unknown employeeId");

   
let request = {
  id: generateId("lv"),
  employeeId,
  leaveType,
  startDate,
  endDate,
  durationDays: daysBetweenInclusive(startDate, endDate),
  status: "Pending",
  reason: reason || "",
  appliedOn: todayISO(),
  decidedOn: null,

  // Employee leave cancellation tracking
  cancellationStatus: null,
  cancellationRequestedOn: null,
  cancellationDecidedOn: null,
};

await persistNewLeaveRequest(request);

try {
  await Notification.create({
    title: "New Leave Request",
    description: `${employee.name} submitted a ${leaveType} request from ${startDate} to ${endDate}.`,
    category: "leave",
    priority: "low",
    recipientEmployeeId: CURRENT_EMPLOYEE_ID,
    relatedEmployeeId: employeeId,
  });
} catch (error) {
  console.error("[leave] Failed to notify admin:", error.message);
}

return withEmployee(request);

  },


async updateStatus(id, status) {
  let request = leaveRequests.find((r) => r.id === id);
  if (!request) return null;

  request.status = status;
  request.decidedOn = todayISO();

  await persistLeaveRequestUpdate(request);

  try {
    const employee = Employee.getById(request.employeeId);

    if (employee && (status === "Approved" || status === "Rejected")) {
      await Notification.create({
        title: `Leave Request ${status}`,
        description: `Your ${request.leaveType} request from ${request.startDate} to ${request.endDate} has been ${status.toLowerCase()}.`,
        category: "leave",
        priority: "low",
        recipientEmployeeId: request.employeeId,
        relatedEmployeeId: request.employeeId,
      });
    }
  } catch (error) {
    console.error("[leave] Failed to notify employee:", error.message);
  }

  return withEmployee(request);
},


async requestCancellation(id, employeeId) {
  let request = leaveRequests.find(
    (r) => r.id === id && r.employeeId === employeeId
  );

  if (!request) return null;

  if (request.status !== "Approved") {
    throw new Error("Only approved leave can be cancelled");
  }

  if (request.cancellationStatus === "Pending") {
    throw new Error("Cancellation request is already pending");
  }

  request.cancellationStatus = "Pending";
  request.cancellationRequestedOn = todayISO();
  request.cancellationDecidedOn = null;

  await persistLeaveRequestUpdate(request);

  return withEmployee(request);
},

async decideCancellation(id, decision) {
  let request = leaveRequests.find((r) => r.id === id);

  if (!request) return null;

  if (
    request.status !== "Approved" ||
    request.cancellationStatus !== "Pending"
  ) {
    throw new Error("No pending cancellation request found");
  }

  if (decision === "Approved") {
    request.status = "Cancelled";
  }

  request.cancellationStatus =
    decision === "Approved" ? "Approved" : "Rejected";

  request.cancellationDecidedOn = todayISO();

  await persistLeaveRequestUpdate(request);

  return withEmployee(request);
},


  
async approveAllPending() {
  let today = todayISO();
  let updated = [];

  for (let r of leaveRequests) {
    if (r.status === "Pending") {
      r.status = "Approved";
      r.decidedOn = today;

      await persistLeaveRequestUpdate(r);

      try {
        const employee = Employee.getById(r.employeeId);

        if (employee) {
          await Notification.create({
            title: "Leave Request Approved",
            description: `Your ${r.leaveType} request from ${r.startDate} to ${r.endDate} has been approved.`,
            category: "leave",
            priority: "low",
            recipientEmployeeId: r.employeeId,
            relatedEmployeeId: r.employeeId,
          });
        }
      } catch (error) {
        console.error(
          "[leave] Failed to notify employee:",
          error.message
        );
      }

      updated.push(withEmployee(r));
    }
  }

  return updated;
},


  /** Admin-only cleanup for a deleted employee: removes their leave request
   * history so the requests list/CSV export don't keep showing rows for
   * someone who no longer has an account. */
  async deleteAllForEmployee(employeeId) {
    return deleteLeaveRequestsByEmployeeId(employeeId);
  },
};
