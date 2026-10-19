import { LeaveRequest } from "./LeaveRequest.js";
import { ApiError } from "../middleware/errorHandler.js";
import {
  attendanceRecords,
  findTodayRecord,
  persistNewAttendance,
  persistAttendanceUpdate,
  deleteAttendanceByEmployeeId,
} from "../data/attendanceStore.js";
import { Employee } from "./Employee.js";

import {
  todayISO,
  formatTimeIST,
  parseClockToMinutes,
} from "../utils/dates.js";

import { generateId } from "../utils/id.js";
import { logActivity } from "../data/activityStore.js";
import { paginate } from "../utils/paginate.js";
import { calculateHoursWorked } from "../utils/attendanceHours.js";

import { Notification } from "./Notification.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";


async function createAttendanceNotifications({
  employeeId,
  employeeName,
  action,
  time,
}) {
  const recipients = [...new Set([employeeId, CURRENT_EMPLOYEE_ID])];

  for (const recipientEmployeeId of recipients) {
    try {
      await Notification.create({
        title: action === "check-in"
          ? "Attendance Check-in"
          : "Attendance Check-out",
        description: `${employeeName} ${
          action === "check-in" ? "checked in" : "checked out"
        } at ${time}.`,
        category: "attendance",
        priority: "low",
        recipientEmployeeId,
        relatedEmployeeId: employeeId,
        avatar: null,
      });
    } catch (error) {
      console.error(
        "[attendance] Failed to create notification:",
        error.message
      );
    }
  }
}

function withEmployee(record) {
  let employee = Employee.getById(record.employeeId);
  return { ...record, employee };
}


function hasApprovedLeaveToday(employeeId) {
  const today = todayISO();

  const requests = LeaveRequest.getAll({
    status: "Approved",
    employeeId,
  });

  return requests.some(
    (request) =>
      request.startDate <= today &&
      request.endDate >= today
  );
}

export let Attendance = {
  /** All records for a given date (defaults to today), optionally filtered. */
  getByDate(date = todayISO(), { department, status, search, employeeId } = {}) {
    let rows = attendanceRecords.filter((r) => r.date === date);

    if (employeeId) {
      rows = rows.filter((r) => r.employeeId === employeeId);
    }
    if (department && department !== "All Departments") {
      rows = rows.filter((r) => Employee.getById(r.employeeId)?.department === department);
    }
    if (status && status !== "All") {
      rows = rows.filter((r) => r.status === status);
    }
    if (search) {
      let q = search.toLowerCase();
      rows = rows.filter((r) => Employee.getById(r.employeeId)?.name.toLowerCase().includes(q));
    }

    return rows.map(withEmployee);
  },

  /** Maps to the AttendanceManagement StatsCards row: Total Expected / Present / Late / Currently Working. */
  getStatsCards(date = todayISO()) {
    let todayRows = this.getByDate(date);
    let workingDayRows = todayRows.filter((r) => r.status !== "Weekend");

    let totalExpected = workingDayRows.length;
    let present = workingDayRows.filter((r) => r.status === "Present" || r.status === "Late").length;
    let late = workingDayRows.filter((r) => r.late).length;
    let currentlyWorking = workingDayRows.filter((r) => r.liveStatus === "Working").length;
    let attendancePct = totalExpected ? Math.round((present / totalExpected) * 1000) / 10 : 0;

    return [
      {
        label: "Total Expected",
        dotColor: "bg-blue-500",
        value: totalExpected.toLocaleString(),
        subLabel: "Employees today",
      },
      {
        label: "Present",
        dotColor: "bg-emerald-500",
        value: present.toLocaleString(),
        subLabel: `${attendancePct}% attendance`,
        badge: null,
        badgeTone: "positive",
      },
      {
        label: "Late Check-ins",
        dotColor: "bg-amber-500",
        value: late.toLocaleString(),
        subLabel: "Needs attention",
        badge: null,
        badgeTone: "negative",
      },
      {
        label: "Currently Working",
        dotColor: "bg-violet-500",
        value: currentlyWorking.toLocaleString(),
        subLabel: "Active sessions",
      },
    ];
  },

  /** Maps to the LiveAttendanceTable — only employees currently clocked in today. */
  getLiveTable(date = todayISO(), filters = {}) {
    return this.getByDate(date, filters)
      .filter((r) => r.liveStatus)
      .map((r) => ({
        id: r.id,
        name: r.employee.name,
        role: r.employee.role,
        department: r.employee.department,
        avatar: r.employee.avatar,
        initials: r.employee.initials,
        checkIn: r.checkIn,
        late: r.late,
        status: r.liveStatus,
        statusTone: r.liveStatus === "Working" ? "working" : "break",
        hours: r.hoursWorked ? `${Math.floor(r.hoursWorked)}h ${Math.round((r.hoursWorked % 1) * 60)}m` : "—",
      }));
  },

  /** Maps to the "Today's Summary" panel: On Time / Late counts. */
  getTodaysSummary(date = todayISO()) {
    let rows = this.getByDate(date).filter((r) => r.status !== "Weekend");
    let onTime = rows.filter((r) => r.status === "Present" && !r.late).length;
    let late = rows.filter((r) => r.late).length;
    return [
      { key: "onTime", label: "On Time", value: onTime.toLocaleString() },
      { key: "late", label: "Late", value: late.toLocaleString() },
    ];
  },

  /** Full, filterable, paginated record list (for the "Export"/"CSV" buttons or a future full table view). */
  list({ date, department, status, search, employeeId, page = 1, pageSize = 20 } = {}) {
    let rows = this.getByDate(date || todayISO(), { department, status, search, employeeId });
    return paginate(rows, { page, pageSize });
  },

  /** All of one employee's records between two ISO dates (inclusive), oldest first. */
  getForEmployee(employeeId, { startISO, endISO } = {}) {
    return attendanceRecords
      .filter(
        (r) =>
          r.employeeId === employeeId &&
          (!startISO || r.date >= startISO) &&
          (!endISO || r.date <= endISO)
      )
      .map(withEmployee)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /** Raw joined rows between two ISO dates (inclusive) — used by the Reports aggregations. */
  getRange(startISO, endISO) {
    return attendanceRecords
      .filter((r) => r.date >= startISO && r.date <= endISO)
      .map(withEmployee);
  },



async checkIn(employeeId) {
  const employee = Employee.getById(employeeId);
  if (!employee) return null;

  
  
if (hasApprovedLeaveToday(employeeId)) {
  throw new ApiError(
    409,
    "You are on approved leave today. Check-in is not allowed."
  );
}

  const SHIFT_START_MINUTES = 10 * 60;
  const now = new Date();
  const checkInTime = formatTimeIST(now);
  const checkInMinutes = parseClockToMinutes(checkInTime);
  const isLate = checkInMinutes > SHIFT_START_MINUTES;

  const existing = findTodayRecord(employeeId);

 
if (existing) {
  const wasCheckedOut = !existing.liveStatus;
  const isFirstCheckIn = !existing.checkIn;

 existing.liveStatus = "Working";

if (isFirstCheckIn) {
  existing.checkIn = checkInTime;
  existing.checkInAt = now.toISOString();
  existing.checkOut = null;
  existing.checkOutAt = null;
  existing.late = isLate;
  existing.status = isLate ? "Late" : "Present";
}

  await persistAttendanceUpdate(existing);

  logActivity("check-in", employeeId, `${employee.name} checked in`);

  // Notify on the first check-in or when returning after checkout.
  if (isFirstCheckIn || wasCheckedOut) {
    await createAttendanceNotifications({
      employeeId,
      employeeName: employee.name,
      action: "check-in",
      time: checkInTime,
    });
  }

  return withEmployee(existing);
}

  const record = {
id: generateId("att"),
employeeId,
date: todayISO(),
status: isLate ? "Late" : "Present",
liveStatus: "Working",
checkIn: checkInTime,
checkOut: null,
checkInAt: now.toISOString(),
checkOutAt: null,
breakStartedAt: null,
breakDurationMs: 0,
late: isLate,
hoursWorked: 0,
};

  await persistNewAttendance(record);
  logActivity("check-in", employeeId, `${employee.name} checked in`);

  await Employee.adjustLeaveAccrual(employeeId, 0.5);

  await createAttendanceNotifications({
    employeeId,
    employeeName: employee.name,
    action: "check-in",
    time: checkInTime,
  });

  return withEmployee(record);
},



 
async checkOut(employeeId) {
  const record = findTodayRecord(employeeId);
  if (!record) return null;

  const now = new Date();

  // Close an active break before checking out.
  if (record.breakStartedAt) {
    const breakStart = new Date(record.breakStartedAt).getTime();

    if (Number.isFinite(breakStart)) {
      record.breakDurationMs =
        (Number(record.breakDurationMs) || 0) +
        Math.max(0, now.getTime() - breakStart);
    }

    record.breakStartedAt = null;
  }

  record.liveStatus = null;
  record.checkOut = formatTimeIST(now);
  record.checkOutAt = now.toISOString();

  record.hoursWorked = Number(
    calculateHoursWorked(record, now).toFixed(2)
  );

  await persistAttendanceUpdate(record);

  const employee = Employee.getById(employeeId);

  if (employee) {
    logActivity("check-out", employeeId, `${employee.name} checked out`);

    // Preserve existing attendance notifications.
    await createAttendanceNotifications({
      employeeId,
      employeeName: employee.name,
      action: "check-out",
      time: record.checkOut,
    });
  }

  return withEmployee(record);
},
 async startBreak(employeeId) {
  const record = findTodayRecord(employeeId);
  if (!record || record.liveStatus !== "Working") return null;

  record.liveStatus = "On Break";
  record.breakStartedAt = new Date().toISOString();

  await persistAttendanceUpdate(record);

  const employee = Employee.getById(employeeId);

  if (employee) {
    logActivity("break", employeeId, `${employee.name} started break`);
  }

  return withEmployee(record);
},

async resumeWork(employeeId) {
  const record = findTodayRecord(employeeId);
  if (!record || record.liveStatus !== "On Break") return null;

  const now = new Date();

  if (record.breakStartedAt) {
    const breakStart = new Date(record.breakStartedAt).getTime();

    if (Number.isFinite(breakStart)) {
      record.breakDurationMs =
        (Number(record.breakDurationMs) || 0) +
        Math.max(0, now.getTime() - breakStart);
    }
  }

  record.breakStartedAt = null;
  record.liveStatus = "Working";

  await persistAttendanceUpdate(record);

  const employee = Employee.getById(employeeId);

  if (employee) {
    logActivity("check-in", employeeId, `${employee.name} resumed work`);
  }

  return withEmployee(record);
},

  async updateStatus(recordId, { status, liveStatus }) {
    let record = attendanceRecords.find((r) => r.id === recordId);
    if (!record) return null;

    let previousStatus = record.status;
    if (status) record.status = status;
    if (liveStatus !== undefined && liveStatus !== record.liveStatus) {
      record.liveStatus = liveStatus;
      let employee = Employee.getById(record.employeeId);
      if (employee && liveStatus === "On Break") {
        logActivity("break", record.employeeId, `${employee.name} started break`);
      }
    }
    await persistAttendanceUpdate(record);

    // Admin correction into/out of "Absent" nudges leave accrual down/up —
    // symmetric with the +0.5 check-in nudge above.
    if (status && status !== previousStatus) {
      if (status === "Absent" && previousStatus !== "Absent") {
        await Employee.adjustLeaveAccrual(record.employeeId, -0.5);
      } else if (previousStatus === "Absent" && status !== "Absent") {
        await Employee.adjustLeaveAccrual(record.employeeId, 0.5);
      }
    }

    return withEmployee(record);
  },

  /** Admin-only cleanup for a deleted employee: removes their attendance
   * history so no record is left pointing at an id Employee.getById can no
   * longer resolve (withEmployee() above doesn't guard against that). */
  async deleteAllForEmployee(employeeId) {
    return deleteAttendanceByEmployeeId(employeeId);
  },
};
