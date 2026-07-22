import { Employee } from "../models/Employee.js";
import { getRange } from "./attendance.service.js";
import { rangeToCutoff, toISODate, todayISO, addDays } from "../utils/dates.js";

function pctChange(current, previous) {
  if (!previous) return "+0.0%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
}

function attendanceRate(rows) {
  const working = rows.filter((r) => r.status !== "weekend");
  if (!working.length) return 0;
  const present = working.filter((r) => ["present", "late"].includes(r.status)).length;
  return (present / working.length) * 100;
}

async function periodRows(range, department) {
  const cutoff = toISODate(rangeToCutoff(range));
  return getRange(cutoff, todayISO(), department);
}

async function previousPeriodRows(range, department) {
  const cutoffDays = { "7d": 7, "30d": 30, "12m": 365 }[range] ?? 365;
  const end = toISODate(addDays(new Date(), -cutoffDays - 1));
  const start = toISODate(addDays(new Date(), -cutoffDays * 2));
  return getRange(start, end, department);
}

export async function getStatsCards(range = "12m", department) {
  const [current, previous, totalEmployees] = await Promise.all([
    periodRows(range, department),
    previousPeriodRows(range, department),
    Employee.countDocuments(department ? { department, isActive: true } : { isActive: true }),
  ]);

  const prevHeadcount = new Set(previous.map((r) => r.employee._id.toString())).size || totalEmployees;
  const currentRate = attendanceRate(current);
  const previousRate = attendanceRate(previous);

  return [
    {
      label: "TOTAL EMPLOYEES",
      value: String(totalEmployees),
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
}

export async function getAttendanceTrends(range = "12m", department) {
  const rows = await periodRows(range, department);
  const byDate = new Map();

  rows.forEach((r) => {
    if (r.status === "weekend") return;
    const key = toISODate(r.date);
    if (!byDate.has(key)) byDate.set(key, { date: key, present: 0, absent: 0, late: 0, leave: 0 });
    const bucket = byDate.get(key);
    if (r.status === "present") bucket.present += 1;
    else if (r.status === "late") bucket.late += 1;
    else if (r.status === "absent") bucket.absent += 1;
    else if (r.status === "on_leave") bucket.leave += 1;
  });

  return [...byDate.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}

export async function getWorkingHoursTrend(range = "12m", department) {
  const rows = (await periodRows(range, department)).filter((r) => r.hoursWorked > 0);
  const byDate = new Map();

  rows.forEach((r) => {
    const key = toISODate(r.date);
    if (!byDate.has(key)) byDate.set(key, { date: key, total: 0, count: 0 });
    const bucket = byDate.get(key);
    bucket.total += r.hoursWorked;
    bucket.count += 1;
  });

  const series = [...byDate.values()]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((b) => ({ date: b.date, avgHours: Math.round((b.total / b.count) * 10) / 10 }));

  const overallAvg = rows.length
    ? Math.round((rows.reduce((sum, r) => sum + r.hoursWorked, 0) / rows.length) * 10) / 10
    : 0;

  return { series, overallAvg };
}

export async function listDepartments() {
  return Employee.distinct("department");
}
