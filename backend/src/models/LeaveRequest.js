import { leaveRequests } from "../data/leaveStore.js";
import { Employee } from "./Employee.js";
import { generateId } from "../utils/id.js";
import { todayISO, isSameMonth, isLastMonth, daysBetweenInclusive } from "../utils/dates.js";

function withEmployee(request) {
  const employee = Employee.getById(request.employeeId);
  return { ...request, employee };
}

export const LeaveRequest = {
  getAll({ status, period, search } = {}) {
    let rows = leaveRequests;

    if (status && status !== "All") {
      rows = rows.filter((r) => r.status === status);
    }
    if (period === "This Month") {
      rows = rows.filter((r) => isSameMonth(r.startDate));
    } else if (period === "Last Month") {
      rows = rows.filter((r) => isLastMonth(r.startDate));
    }
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => Employee.getById(r.employeeId)?.name.toLowerCase().includes(q));
    }

    return rows
      .map(withEmployee)
      .sort((a, b) => new Date(b.appliedOn) - new Date(a.appliedOn));
  },

  getById(id) {
    const request = leaveRequests.find((r) => r.id === id);
    return request ? withEmployee(request) : null;
  },

  /** Maps to the Leave Management StatsCards row: Pending / Approved Today / On Leave Today. */
  getStatsCards() {
    const today = todayISO();
    const pending = leaveRequests.filter((r) => r.status === "Pending").length;
    const approvedToday = leaveRequests.filter((r) => r.status === "Approved" && r.decidedOn === today).length;
    const onLeaveToday = leaveRequests.filter(
      (r) => r.status === "Approved" && r.startDate <= today && r.endDate >= today
    ).length;

    return [
      { key: "pending", tag: "Pending", label: "Pending Requests", value: String(pending) },
      { key: "approvedToday", tag: "Today", label: "Approved Today", value: String(approvedToday) },
      { key: "onLeaveToday", tag: "Active", label: "On Leave Today", value: String(onLeaveToday) },
    ];
  },

  /** Maps to the "Team Availability (Today)" panel. */
  getTeamAvailability() {
    const today = todayISO();
    const totalEmployees = Employee.getAll().length;

    const onLeaveIds = new Set(
      leaveRequests
        .filter((r) => r.status === "Approved" && r.startDate <= today && r.endDate >= today)
        .map((r) => r.employeeId)
    );
    const onSickLeaveIds = new Set(
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

    const onLeave = onLeaveIds.size;
    const sick = onSickLeaveIds.size;
    const working = Math.max(totalEmployees - onLeave, 0);

    return [
      { key: "working", label: "Working", value: String(working), dotColor: "bg-emerald-500" },
      { key: "onLeave", label: "On Leave", value: String(onLeave - sick), dotColor: "bg-amber-500" },
      { key: "sickLeave", label: "Sick Leave", value: String(sick), dotColor: "bg-red-500" },
    ];
  },

  create({ employeeId, leaveType, startDate, endDate, reason }) {
    const employee = Employee.getById(employeeId);
    if (!employee) throw new Error("Unknown employeeId");

    const request = {
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
    };
    leaveRequests.unshift(request);
    return withEmployee(request);
  },

  updateStatus(id, status) {
    const request = leaveRequests.find((r) => r.id === id);
    if (!request) return null;
    request.status = status;
    request.decidedOn = todayISO();
    return withEmployee(request);
  },

  approveAllPending() {
    const today = todayISO();
    const updated = [];
    leaveRequests.forEach((r) => {
      if (r.status === "Pending") {
        r.status = "Approved";
        r.decidedOn = today;
        updated.push(withEmployee(r));
      }
    });
    return updated;
  },
};
