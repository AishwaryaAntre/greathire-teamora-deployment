import { attendanceRecords, findTodayRecord } from "../data/attendanceStore.js";
import { Employee } from "./Employee.js";
import { todayISO } from "../utils/dates.js";
import { generateId } from "../utils/id.js";
import { logActivity } from "../data/activityStore.js";

function withEmployee(record) {
  const employee = Employee.getById(record.employeeId);
  return { ...record, employee };
}

export const Attendance = {
  /** All records for a given date (defaults to today), optionally filtered. */
  getByDate(date = todayISO(), { department, status, search } = {}) {
    let rows = attendanceRecords.filter((r) => r.date === date);

    if (department && department !== "All Departments") {
      rows = rows.filter((r) => Employee.getById(r.employeeId)?.department === department);
    }
    if (status && status !== "All") {
      rows = rows.filter((r) => r.status === status);
    }
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => Employee.getById(r.employeeId)?.name.toLowerCase().includes(q));
    }

    return rows.map(withEmployee);
  },

  /** Maps to the AttendanceManagement StatsCards row: Total Expected / Present / Late / Currently Working. */
  getStatsCards(date = todayISO()) {
    const todayRows = this.getByDate(date);
    const workingDayRows = todayRows.filter((r) => r.status !== "Weekend");

    const totalExpected = workingDayRows.length;
    const present = workingDayRows.filter((r) => r.status === "Present" || r.status === "Late").length;
    const late = workingDayRows.filter((r) => r.late).length;
    const currentlyWorking = workingDayRows.filter((r) => r.liveStatus === "Working").length;
    const attendancePct = totalExpected ? Math.round((present / totalExpected) * 1000) / 10 : 0;

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
    const rows = this.getByDate(date).filter((r) => r.status !== "Weekend");
    const onTime = rows.filter((r) => r.status === "Present" && !r.late).length;
    const late = rows.filter((r) => r.late).length;
    return [
      { key: "onTime", label: "On Time", value: onTime.toLocaleString() },
      { key: "late", label: "Late", value: late.toLocaleString() },
    ];
  },

  /** Full, filterable, paginated record list (for the "Export"/"CSV" buttons or a future full table view). */
  list({ date, department, status, search, page = 1, pageSize = 20 } = {}) {
    const rows = this.getByDate(date || todayISO(), { department, status, search });
    const start = (page - 1) * pageSize;
    return {
      data: rows.slice(start, start + pageSize),
      total: rows.length,
      page: Number(page),
      pageSize: Number(pageSize),
    };
  },

  /** Raw joined rows between two ISO dates (inclusive) — used by the Reports aggregations. */
  getRange(startISO, endISO) {
    return attendanceRecords
      .filter((r) => r.date >= startISO && r.date <= endISO)
      .map(withEmployee);
  },

  checkIn(employeeId) {
    const employee = Employee.getById(employeeId);
    if (!employee) return null;

    const existing = findTodayRecord(employeeId);
    if (existing) {
      existing.liveStatus = "Working";
      if (!existing.checkIn) {
        existing.checkIn = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      }
      existing.status = "Present";
      logActivity("check-in", employeeId, `${employee.name} checked in`);
      return withEmployee(existing);
    }

    const record = {
      id: generateId("att"),
      employeeId,
      date: todayISO(),
      status: "Present",
      liveStatus: "Working",
      checkIn: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      checkOut: null,
      late: false,
      hoursWorked: 0,
    };
    attendanceRecords.unshift(record);
    logActivity("check-in", employeeId, `${employee.name} checked in`);
    return withEmployee(record);
  },

  checkOut(employeeId) {
    const record = findTodayRecord(employeeId);
    if (!record) return null;
    record.liveStatus = null;
    record.checkOut = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const employee = Employee.getById(employeeId);
    if (employee) logActivity("check-out", employeeId, `${employee.name} checked out`);
    return withEmployee(record);
  },

  updateStatus(recordId, { status, liveStatus }) {
    const record = attendanceRecords.find((r) => r.id === recordId);
    if (!record) return null;
    if (status) record.status = status;
    if (liveStatus !== undefined && liveStatus !== record.liveStatus) {
      record.liveStatus = liveStatus;
      const employee = Employee.getById(record.employeeId);
      if (employee && liveStatus === "On Break") {
        logActivity("break", record.employeeId, `${employee.name} started break`);
      }
    }
    return withEmployee(record);
  },
};
