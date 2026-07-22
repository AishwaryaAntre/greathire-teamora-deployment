import { Attendance } from "./Attendance.js";
import { Employee } from "./Employee.js";
import { generatedReports } from "../data/reportsStore.js";
import { generateId } from "../utils/id.js";
import { rangeToCutoff, toISODate, todayISO, addDays } from "../utils/dates.js";

function periodRows(range, department) {
  let cutoff = toISODate(rangeToCutoff(range));
  let rows = Attendance.getRange(cutoff, todayISO());
  if (!department || department === "All Departments") return rows;
  return rows.filter((r) => r.employee?.department === department);
}

function previousPeriodRows(range, department) {
  let cutoffDays = { "7d": 7, "30d": 30, "12m": 365 }[range] ?? 365;
  let end = toISODate(addDays(new Date(), -cutoffDays - 1));
  let start = toISODate(addDays(new Date(), -cutoffDays * 2));
  let rows = Attendance.getRange(start, end);
  if (!department || department === "All Departments") return rows;
  return rows.filter((r) => r.employee?.department === department);
}

function pctChange(current, previous) {
  if (!previous) return "+0.0%";
  let change = ((current - previous) / previous) * 100;
  let sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

function attendanceRate(rows) {
  let working = rows.filter((r) => r.status !== "Weekend");
  if (!working.length) return 0;
  let present = working.filter((r) => r.status === "Present" || r.status === "Late").length;
  return (present / working.length) * 100;
}

export let Report = {
  /** Maps to the Reports StatsCards row: Total Employees / Avg Attendance, each with a vs-last-period change. */
  getStatsCards(range = "12m", department) {
    let current = periodRows(range, department);
    let previous = previousPeriodRows(range, department);

    let totalEmployees = Employee.getAll(department).length;
    let prevHeadcount = new Set(previous.map((r) => r.employeeId)).size || totalEmployees;

    let currentRate = attendanceRate(current);
    let previousRate = attendanceRate(previous);

    return [
      {
        label: "TOTAL EMPLOYEES",
        value: totalEmployees.toLocaleString(),
        change: pctChange(totalEmployees, prevHeadcount),
        changeLabel: "vs last period",
      },
      {
        label: "AVG ATTENDANCE",
        value: `${currentRate.toFixed(0)}%`,
        change: pctChange(currentRate, previousRate),
        changeLabel: "vs last period",
      },
    ];
  },

  /** Maps to the "Attendance Trends" multi-series chart: Present / Absent / Leave / Late per day. */
  getAttendanceTrends(range = "12m", department) {
    let rows = periodRows(range, department);
    let byDate = new Map();

    rows.forEach((r) => {
      if (r.status === "Weekend") return;
      if (!byDate.has(r.date)) {
        byDate.set(r.date, { date: r.date, present: 0, absent: 0, late: 0, leave: 0 });
      }
      let bucket = byDate.get(r.date);
      if (r.status === "Present") bucket.present += 1;
      else if (r.status === "Late") bucket.late += 1;
      else if (r.status === "Absent") bucket.absent += 1;
    });

    return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
  },

  /** Maps to the "Avg Working Hours" area chart. */
  getWorkingHoursTrend(range = "12m", department) {
    let rows = periodRows(range, department).filter((r) => r.hoursWorked > 0);
    let byDate = new Map();

    rows.forEach((r) => {
      if (!byDate.has(r.date)) byDate.set(r.date, { date: r.date, total: 0, count: 0 });
      let bucket = byDate.get(r.date);
      bucket.total += r.hoursWorked;
      bucket.count += 1;
    });

    let series = [...byDate.values()]
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((b) => ({ date: b.date, avgHours: Math.round((b.total / b.count) * 10) / 10 }));

    let overallAvg = rows.length
      ? Math.round((rows.reduce((sum, r) => sum + r.hoursWorked, 0) / rows.length) * 10) / 10
      : 0;

    return { series, overallAvg };
  },

  listDepartments() {
    return Employee.listDepartments();
  },

  /** Simulates kicking off an async report job (the "Generate" button). */
  generate({ range = "12m", department = "All Departments", title } = {}) {
    let report = {
      id: generateId("rpt"),
      title: title || `${department} attendance report — ${range}`,
      range,
      department,
      status: "ready", // no real job queue here; instant for an in-memory demo backend
      createdAt: new Date().toISOString(),
      stats: this.getStatsCards(range, department),
    };
    generatedReports.unshift(report);
    return report;
  },

  listGenerated() {
    return generatedReports;
  },
};
