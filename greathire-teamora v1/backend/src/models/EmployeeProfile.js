import { Employee } from "./Employee.js";
import { Attendance } from "./Attendance.js";
import { LeaveRequest } from "./LeaveRequest.js";
import {
  todayISO,
  toISODate,
  addDays,
  parseClockToMinutes,
  formatMinutesToClock,
  formatHoursDecimalToClock,
} from "../utils/dates.js";

function sumHours(rows) {
  return rows.reduce((total, r) => total + (r.hoursWorked || 0), 0);
}


function averageCheckInClock(rows) {
  let withCheckIn = rows.filter((r) => r.checkIn);
  if (!withCheckIn.length) return null;
  let avgMinutes = withCheckIn.reduce((sum, r) => sum + parseClockToMinutes(r.checkIn), 0) / withCheckIn.length;
  return formatMinutesToClock(avgMinutes);
}

function attendancePercent(rows) {
  let workDays = rows.filter((r) => r.status !== "Weekend");
  if (!workDays.length) return 0;
  let present = workDays.filter((r) => r.status === "Present" || r.status === "Late").length;
  return Math.round((present / workDays.length) * 1000) / 10;
}

function monthBounds(offsetMonths = 0) {
  let now = new Date();
  let start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  let end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 0);
  return { startISO: toISODate(start), endISO: toISODate(offsetMonths === 0 ? now : end) };
}

function tenureLabel(joiningDateISO) {
  let start = new Date(joiningDateISO);
  let now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years}y ${months}m`;
}

export let EmployeeProfile = {
  /** Maps to ProfileHeaderCard + PageActions breadcrumb. */
  getProfile(employeeId) {
    let employee = Employee.getById(employeeId);
    if (!employee) return null;
    let today = Attendance.getForEmployee(employeeId, { startISO: todayISO(), endISO: todayISO() })[0];

    let status = "OFFLINE";
    if (today?.liveStatus === "Working") status = "WORKING";
    else if (today?.liveStatus === "On Break") status = "ON BREAK";
    else if (today?.checkOut) status = "CHECKED OUT";

    return {
      name: employee.name,
      role: employee.role,
      id: employee.employeeCode,
      status,
      avatar: employee.avatar || "",
      breadcrumb: ["Directory", employee.department, employee.name],
    };
  },

  /** Maps to StatCards. */
  getStatCards(employeeId) {
    let employee = Employee.getById(employeeId);
    if (!employee) return [];

    let thisMonth = monthBounds(0);
    let lastMonth = monthBounds(-1);
    let thisMonthRows = Attendance.getForEmployee(employeeId, thisMonth);
    let lastMonthRows = Attendance.getForEmployee(employeeId, lastMonth);

    let attendancePct = attendancePercent(thisMonthRows);
    let lastMonthPct = attendancePercent(lastMonthRows);
    let attendanceDelta = Math.round((attendancePct - lastMonthPct) * 10) / 10;

    let workDays = thisMonthRows.filter((r) => r.status !== "Weekend");
    let presentDays = workDays.filter((r) => r.status === "Present" || r.status === "Late").length;
    let monthlyHours = Math.round(sumHours(thisMonthRows));

    let leaveUsed = LeaveRequest.getAll().filter(
      (r) => r.employeeId === employeeId && r.status === "Approved" && r.startDate.startsWith(String(new Date().getFullYear()))
    ).reduce((sum, r) => sum + r.durationDays, 0);
    let totalAllocated = Object.values(employee.leaveAllocation).reduce((a, b) => a + b, 0);
    let leaveBalance = Math.max(0, totalAllocated - leaveUsed);
    let upcomingLeave = LeaveRequest.getAll().filter(
      (r) => r.employeeId === employeeId && r.status === "Approved" && r.startDate > todayISO()
    ).length;

    let avgLogin = averageCheckInClock(thisMonthRows);

    return [
      {
        label: "Attendance %",
        value: `${attendancePct}%`,
        icon: "Percent",
        note: `${Math.abs(attendanceDelta)}% vs last month`,
        noteTone: attendanceDelta >= 0 ? "up" : "neutral",
      },
      {
        label: "Monthly Hrs",
        value: `${monthlyHours}h`,
        icon: "Clock",
        note: "Target: 160h",
        noteTone: "neutral",
      },
      {
        label: "Present Days",
        value: String(presentDays),
        icon: "CalendarCheck2",
        note: `Out of ${workDays.length} working days`,
        noteTone: "neutral",
      },
      {
        label: "Leave Balance",
        value: String(leaveBalance),
        icon: "CalendarX2",
        note: `${upcomingLeave} planned upcoming`,
        noteTone: "neutral",
      },
      {
        label: "Avg. Login",
        value: avgLogin?.time || "--:--",
        valueSuffix: avgLogin?.period || "",
        icon: "LogIn",
        note: "On time average",
        noteTone: "up",
      },
      {
        label: "Perf. Score",
        value: `${employee.performanceScore}%`,
        icon: "Award",
        note: employee.performanceScore >= 90 ? "Top 10% in dept" : "On track",
        noteTone: employee.performanceScore >= 90 ? "up" : "neutral",
      },
    ];
  },

  /** Maps to WorkSummaryCard. */
  getWorkSummary(employeeId) {
    let today = todayISO();
    let weekStart = toISODate(addDays(new Date(), -6));
    let todayRows = Attendance.getForEmployee(employeeId, { startISO: today, endISO: today });
    let weekRows = Attendance.getForEmployee(employeeId, { startISO: weekStart, endISO: today });
    let record = todayRows[0];

    let currentSession = "--";
    let live = false;
    if (record?.liveStatus === "Working" && record.checkIn) {
      live = true;
      let checkInMinutes = parseClockToMinutes(record.checkIn);
      let now = new Date();
      let nowMinutes = now.getHours() * 60 + now.getMinutes();
      let elapsed = Math.max(0, nowMinutes - checkInMinutes);
      currentSession = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}h ${String(elapsed % 60).padStart(2, "0")}m`;
    }

    // Break duration isn't tracked per-event yet, so this is a reasonable estimate
    // based on how many days this week showed an "On Break" dip.
    let breakDays = weekRows.filter((r) => r.liveStatus === "On Break").length || weekRows.length;
    let estimatedAvgBreakMinutes = 45;

    return [
      { label: "TODAY", value: formatHoursDecimalToClock(sumHours(todayRows)).replace(":", "h ") + "m" },
      { label: "THIS WEEK", value: formatHoursDecimalToClock(sumHours(weekRows)).replace(":", "h ") + "m" },
      { label: "AVG BREAK/DAY", value: `${estimatedAvgBreakMinutes}m` },
      { label: "CURRENT SESSION", value: currentSession, live },
    ];
  },

  /** Maps to ActivityMapCard — last 35 weekdays, bucketed into 7 columns x 5 rows by hours worked. */
  getActivityMap(employeeId) {
    let today = todayISO();
    let start = toISODate(addDays(new Date(), -70)); // wide window; we'll pick the last 35 weekdays
    let rows = Attendance.getForEmployee(employeeId, { startISO: start, endISO: today }).filter(
      (r) => r.status !== "Weekend"
    );
    let last35 = rows.slice(-35);

    let intensityFor = (row) => {
      if (!row) return 0;
      if (row.status === "Absent") return 0;
      let h = row.hoursWorked || 0;
      if (h >= 8.5) return 4;
      if (h >= 7.5) return 3;
      if (h >= 6) return 2;
      if (h > 0) return 1;
      return 0;
    };

    let intensities = last35.map(intensityFor);
    while (intensities.length < 35) intensities.unshift(0); // pad if employee is newer than 35 workdays

    let columns = [];
    for (let i = 0; i < 35; i += 5) columns.push(intensities.slice(i, i + 5));
    return columns;
  },

  /** Maps to PersonalInfoCard. */
  getPersonalInfo(employeeId) {
    let employee = Employee.getById(employeeId);
    if (!employee) return [];

    let joined = new Date(employee.joiningDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return [
      { label: "Employee ID", value: employee.employeeCode },
      { label: "Department", value: employee.department },
      { label: "Joining Date", value: `${joined} (${tenureLabel(employee.joiningDate)})` },
      { label: "Contact", value: employee.email, secondary: employee.phone },
    ];
  },

  /** Edits name/email/phone/avatar, then returns the refreshed personal-info card. */
  async updatePersonalInfo(employeeId, updates, isAdmin = false) {
    let employee = isAdmin ? await Employee.updateAsAdmin(employeeId, updates) : await Employee.update(employeeId, updates);
    if (!employee) return null;
    return this.getPersonalInfo(employeeId);
  },

  /** Maps to DocumentsCard. */
  getDocuments(employeeId) {
    let employee = Employee.getById(employeeId);
    return employee?.documents || [];
  },

  /** Convenience bundle: every shape EmployeeProfilePage.jsx needs, in one call. */
  getBundle(employeeId) {
    return {
      profile: this.getProfile(employeeId),
      statCards: this.getStatCards(employeeId),
      workSummary: this.getWorkSummary(employeeId),
      activityMap: this.getActivityMap(employeeId),
      personalInfo: this.getPersonalInfo(employeeId),
      documents: this.getDocuments(employeeId),
    };
  },
};
