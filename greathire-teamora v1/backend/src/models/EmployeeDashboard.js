import { Employee } from "./Employee.js";
import { Attendance } from "./Attendance.js";
import { LeaveRequest } from "./LeaveRequest.js";
import { activityLog } from "../data/activityStore.js";
import { holidays } from "../data/holidaysStore.js";
import { announcements } from "../data/announcementsStore.js";
import {
  todayISO,
  addDays,
  toISODate,
  isWeekend,
  daysInMonth,
  formatPrettyDate,
  formatHoursDecimalToClock,
  parseClockToMinutes,
  formatMinutesToClock,
} from "../utils/dates.js";

let LEAVE_TYPE_TO_BALANCE_KEY = { Annual: "paid", Casual: "casual", "Sick Leave": "sick" };

function startOfWeek(date) {
  // Monday-start week, matching the rest of the app's Mon-Fri work week.
  let d = new Date(date);
  let day = d.getDay();
  let diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function sumHours(rows) {
  return rows.reduce((total, r) => total + (r.hoursWorked || 0), 0);
}

function averageCheckIn(rows) {
  let withCheckIn = rows.filter((r) => r.checkIn);
  if (!withCheckIn.length) return null;
  let avgMinutes = withCheckIn.reduce((sum, r) => sum + parseClockToMinutes(r.checkIn), 0) / withCheckIn.length;
  return formatMinutesToClock(avgMinutes);
}

/** Approved leave requests for this employee that cover the given ISO date. */
function leaveStatusFor(employeeId, dateISO) {
  let requests = LeaveRequest.getAll().filter(
    (r) => r.employeeId === employeeId && r.status === "Approved" && r.startDate <= dateISO && r.endDate >= dateISO
  );
  return requests[0] || null;
}

export let EmployeeDashboard = {
  /** Maps to EmployeeTopBar / GreetingBanner's `currentUser`. */
  getCurrentUser(employeeId) {
    let employee = Employee.getById(employeeId);
    if (!employee) return null;
    let today = Attendance.getForEmployee(employeeId, { startISO: todayISO(), endISO: todayISO() })[0];

    return {
      name: employee.name,
      role: employee.role,
      avatarUrl: employee.avatar || "",
      todayLabel: formatPrettyDate(todayISO()),
      lastLogin: today?.checkIn ? `${today.checkIn} Today` : "Not checked in yet",
    };
  },

  /** Maps to CurrentStatusCard. */
  getCurrentStatus(employeeId) {
    let employee = Employee.getById(employeeId);
    let today = Attendance.getForEmployee(employeeId, { startISO: todayISO(), endISO: todayISO() })[0];

    let state = "Checked Out";
    if (today?.liveStatus === "Working") state = "Working";
    else if (today?.liveStatus === "On Break") state = "On Break";
    else if (!today?.checkIn) state = "Not Checked In";

    let currentSession = "--";
    if (state === "Working" && today?.checkIn) {
      let checkInMinutes = parseClockToMinutes(today.checkIn);
      let now = new Date();
      let nowMinutes = now.getHours() * 60 + now.getMinutes();
      let elapsed = Math.max(0, nowMinutes - checkInMinutes);
      currentSession = `${Math.floor(elapsed / 60)}h ${elapsed % 60}m`;
    }

    return {
      state,
      checkIn: today?.checkIn || null,
      currentSession,
      todaysGoal: "8 Hours",
      taskLoadPercent: employee?.taskLoadPercent ?? 0,
    };
  },
/** Maps to QuickActionsGrid — static button config; the actions themselves call the Attendance API. */

  getQuickActions() {
    return [
      { id: "check-in", label: "Check In", icon: "LogIn", tone: "success" },
      { id: "start-break", label: "Start Break", icon: "Coffee", tone: "warning" },
      { id: "resume-work", label: "Resume Work", icon: "Play", tone: "info" },
      { id: "check-out", label: "Check Out", icon: "LogOut", tone: "danger" },
    ];
  },
  /** Maps to StatsRow. */
getHoursStats(employeeId){
  let today = todayISO();
  let weekStartISO = toISODate(startOfWeek(new Date()));
  let monthStartISO = toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  let todayRows = Attendance.getForEmployee(employeeId, { startISO: today, endISO: today });
  let weekRows = Attendance.getForEmployee(employeeId, { startISO: weekStartISO, endISO: today });
  let monthRows = Attendance.getForEmployee(employeeId, { startISO: monthStartISO, endISO: today });

   let avgLogin = averageCheckIn(monthRows);

    return [
      { id: "today", label: "Today's Hours", value: formatHoursDecimalToClock(sumHours(todayRows)) },
      { id: "weekly", label: "Weekly Hours", value: formatHoursDecimalToClock(sumHours(weekRows)) },
      { id: "monthly", label: "Monthly Hours", value: formatHoursDecimalToClock(sumHours(monthRows)) },
      { id: "avg-login", label: "Avg. Login", value: avgLogin?.time || "--:--", suffix: avgLogin?.period || "" },
    ];
  },
  /** Maps to AttendanceCalendar. `year`/`month` (0-indexed) default to the current month. */
  getAttendanceMonth(employeeId, year, month) {
    let now = new Date();
    let y = year ?? now.getFullYear();
    let m = month ?? now.getMonth();
    let first = new Date(y, m, 1);
    let totalDays = daysInMonth(first);
    let today = todayISO();

    let rowsByDate = new Map(
      Attendance.getForEmployee(employeeId, {
        startISO: toISODate(first),
        endISO: toISODate(new Date(y, m, totalDays)),
      }).map((r) => [r.date, r])
    );


    // Monday-start grid: figure out how many muted lead-in days from the previous month we need.
    let leadIn = (first.getDay() + 6) % 7; // 0 = Monday
    let cells = [];

    for (let i = leadIn; i > 0; i -= 1) {
      let d = addDays(first, -i);
      cells.push({ date: d.getDate(), status: "muted" });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      let date = new Date(y, m, day);
      let dateISO = toISODate(date);
      let status;

      if (dateISO === today) {
        status = "today";
      } else if (isWeekend(date)) {
        status = "weekend";
      } else {
        let record = rowsByDate.get(dateISO);
        if (leaveStatusFor(employeeId, dateISO)) status = "leave";
        else if (!record) status = dateISO > today ? "muted" : "absent";
        else if (record.status === "Late") status = "late";
        else if (record.status === "Present") status = "present";
        else status = "absent";
      }
      cells.push({ date: day, status });
    }

    // Trailing muted days from next month to complete the final week.
    let trail = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
    for (let i = 1; i <= trail; i += 1) cells.push({ date: i, status: "muted" });

    let weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return {
      label: first.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weeks,
    };
  },

  /** Maps to AttendanceLegend — static, always the same 4 categories. */
  getAttendanceLegend() {
    return [
      { id: "present", label: "Present", color: "bg-emerald-500" },
      { id: "absent", label: "Absent", color: "bg-rose-500" },
      { id: "leave", label: "Leave", color: "bg-blue-500" },
      { id: "late", label: "Late", color: "bg-amber-500" },
    ];
  },

  /** Maps to TimelineCard — today's real check-in/break/check-out events. */
  getTimeline(employeeId) {
    let today = todayISO();
    let todaysEvents = activityLog
      .filter((e) => e.employeeId === employeeId && e.timestamp.startsWith(today))
      .slice()
      .reverse(); // oldest first

    let stateForType = { "check-in": "done", break: "warning", "check-out": "done" };
    let items = todaysEvents.map((e, idx) => ({
      id: idx + 1,
      time: new Date(e.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      label: e.type === "check-in" ? "Checked In" : e.type === "break" ? "Break Started" : "Checked Out",
      state: stateForType[e.type] || "done",
    }));

    let record = Attendance.getForEmployee(employeeId, { startISO: today, endISO: today })[0];
    if (!record?.checkOut) {
      items.push({ id: items.length + 1, time: null, label: "Pending Check Out", state: "pending" });
    }

    return items;
  },

  /** Maps to LeaveBalanceCard. */
  getLeaveBalances(employeeId) {
    let employee = Employee.getById(employeeId);
    if (!employee) return [];
    let year = new Date().getFullYear();

    let usedByKey = { casual: 0, paid: 0, sick: 0 };
    LeaveRequest.getAll()
      .filter((r) => r.employeeId === employeeId && r.status === "Approved" && r.startDate.startsWith(String(year)))
      .forEach((r) => {
        let key = LEAVE_TYPE_TO_BALANCE_KEY[r.leaveType];
        if (key) usedByKey[key] += r.durationDays;
      });

    let { casual, paid, sick } = employee.leaveAllocation;
    let available = {
      casual: Math.max(0, casual - usedByKey.casual),
      paid: Math.max(0, paid - usedByKey.paid),
      sick: Math.max(0, sick - usedByKey.sick),
    };

    return [
      { id: "casual", label: "Casual Leave", sublabel: `${available.casual} days available`, value: available.casual, icon: "MapPin", tone: "blue" },
      { id: "paid", label: "Paid Leave", sublabel: `${available.paid} days available`, value: available.paid, icon: "Wallet", tone: "emerald" },
      { id: "sick", label: "Sick Leave", sublabel: `${available.sick} days available`, value: available.sick, icon: "HeartPulse", tone: "rose" },
    ];
  },

  /** Maps to UpcomingHolidaysCard. */
  getUpcomingHolidays(limit = 2) {
    let today = todayISO();
    return holidays
      .filter((h) => h.date >= today)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, limit)
      .map((h) => {
        let d = new Date(h.date);
        return {
          id: h.name.toLowerCase().replace(/\s+/g, "-"),
          day: String(d.getDate()).padStart(2, "0"),
          month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
          name: h.name,
          meta: `${d.toLocaleDateString("en-US", { weekday: "long" })} • ${h.type}`,
        };
      });
  },

  /** Maps to QuickLinksCard — static navigation config. */
  getQuickLinks() {
    return [
      { id: "history", label: "Attendance History", icon: "History" },
      { id: "report", label: "Download Report", icon: "Download" },
      { id: "payslip", label: "View Payslip", icon: "FileText" },
      { id: "policies", label: "Company Policies", icon: "ShieldCheck" },
    ];
  },

  /** Maps to AttendanceSummaryCard — current month at a glance. */
  getAttendanceSummary(employeeId) {
    let today = todayISO();
    let monthStartISO = toISODate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    let rows = Attendance.getForEmployee(employeeId, { startISO: monthStartISO, endISO: today }).filter(
      (r) => r.status !== "Weekend"
    );

    let presentDays = rows.filter((r) => r.status === "Present" || r.status === "Late").length;
    let lateDays = rows.filter((r) => r.status === "Late").length;
    let leavesTaken = LeaveRequest.getAll().filter(
      (r) => r.employeeId === employeeId && r.status === "Approved" && r.startDate >= monthStartISO && r.startDate <= today
    ).length;
    let attendancePct = rows.length ? Math.round((presentDays / rows.length) * 100) : 0;

    return [
      { id: "percent", label: "Attendance %", value: `${attendancePct}%`, icon: "Percent", tone: "blue" },
      { id: "present", label: "Present Days", value: String(presentDays).padStart(2, "0"), icon: "CheckCircle2", tone: "emerald" },
      { id: "late", label: "Late Days", value: String(lateDays).padStart(2, "0"), icon: "Clock", tone: "amber" },
      { id: "leaves", label: "Leaves Taken", value: String(leavesTaken).padStart(2, "0"), icon: "CalendarX2", tone: "rose" },
    ];
  },

  /** Maps to AnnouncementCard — most recent company announcement. */
  getAnnouncement() {
    let [latest] = announcements;
    if (!latest) return null;
    let { id, postedOn, ...rest } = latest;
    return rest;
  },

  /** Convenience bundle: every shape EmployeeDashboardPage.jsx needs, in one call. */
  getBundle(employeeId) {
    return {
      currentUser: this.getCurrentUser(employeeId),
      currentStatus: this.getCurrentStatus(employeeId),
      quickActions: this.getQuickActions(),
      hoursStats: this.getHoursStats(employeeId),
      attendanceLegend: this.getAttendanceLegend(),
      attendanceMonth: this.getAttendanceMonth(employeeId),
      timeline: this.getTimeline(employeeId),
      leaveBalances: this.getLeaveBalances(employeeId),
      upcomingHolidays: this.getUpcomingHolidays(),
      quickLinks: this.getQuickLinks(),
      attendanceSummary: this.getAttendanceSummary(employeeId),
      announcement: this.getAnnouncement(),
    };
  },
};


