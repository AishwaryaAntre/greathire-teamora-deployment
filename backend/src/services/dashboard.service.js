import { Employee } from "../models/Employee.js";
import { Attendance } from "../models/Attendance.js";
import { Notification } from "../models/Notification.js";
import { startOfDay, endOfDay, addDays, formatPrettyDate, timeAgo } from "../utils/dates.js";

export async function getOverview(adminName) {
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  const [totalEmployees, liveOnline, todayAttendance] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Employee.countDocuments({ status: { $in: ["working", "on_break"] } }),
    Attendance.find({ date: { $gte: dayStart, $lte: dayEnd }, status: { $ne: "weekend" } }).lean(),
  ]);

  const present = todayAttendance.filter((r) => ["present", "late"].includes(r.status)).length;
  const attendancePct = todayAttendance.length ? Math.round((present / todayAttendance.length) * 1000) / 10 : 0;

  return {
    adminName,
    dateLabel: formatPrettyDate(today),
    stats: [
      { label: "TOTAL EMPLOYEES", value: String(totalEmployees), tone: "neutral" },
      { label: "LIVE ONLINE", value: String(liveOnline), tone: "blue", withDot: true },
      { label: "ATTENDANCE", value: `${attendancePct}%`, tone: "green" },
    ],
  };
}

export async function getSnapshot() {
  const [total, working, onBreak, onLeave] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Employee.countDocuments({ status: "working" }),
    Employee.countDocuments({ status: "on_break" }),
    Employee.countDocuments({ status: "on_leave" }),
  ]);

  const pct = (n) => (total ? Math.round((n / total) * 100) : 0);

  return [
    { label: "Total Employees", value: total, percent: 100 },
    { label: "Working", value: working, percent: pct(working) },
    { label: "Break", value: onBreak, percent: pct(onBreak) },
    { label: "Leave", value: onLeave, percent: pct(onLeave) },
  ];
}

export async function getMetrics() {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());
  const yesterday = startOfDay(addDays(new Date(), -1));
  const yesterdayEnd = endOfDay(addDays(new Date(), -1));

  const [totalEmployees, todayRows, yesterdayRows] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Attendance.find({ date: { $gte: today, $lte: tomorrow } }).lean(),
    Attendance.find({ date: { $gte: yesterday, $lte: yesterdayEnd } }).lean(),
  ]);

  const avg = (rows) => {
    const worked = rows.filter((r) => r.hoursWorked > 0).map((r) => r.hoursWorked);
    return worked.length ? worked.reduce((a, b) => a + b, 0) / worked.length : 0;
  };

  const todayAvg = avg(todayRows);
  const yesterdayAvg = avg(yesterdayRows);
  const trendPct = yesterdayAvg ? Math.round(((todayAvg - yesterdayAvg) / yesterdayAvg) * 1000) / 10 : 0;

  return {
    totalEmployees,
    currentlyWorking: todayRows.filter((r) => r.liveStatus === "working").length,
    onBreak: todayRows.filter((r) => r.liveStatus === "on_break").length,
    avgWorkingHours: Math.round(todayAvg * 10) / 10,
    avgWorkingHoursTrendPct: trendPct,
  };
}

export async function getLiveWorkforce(limit = 10) {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  const active = await Attendance.find({
    date: { $gte: today, $lte: tomorrow },
    liveStatus: { $ne: null },
  })
    .populate("employee", "name jobTitle avatarUrl")
    .limit(limit)
    .lean();

  return active.map((r) => ({
    id: r.employee?._id,
    name: r.employee?.name,
    role: r.employee?.jobTitle,
    avatarUrl: r.employee?.avatarUrl,
    status: r.liveStatus === "working" ? "working" : "break",
    checkIn: r.checkInAt,
  }));
}

export async function getRecentActivity(limit = 10) {
  const rows = await Notification.find().sort({ createdAt: -1 }).limit(limit).lean();
  return rows.map((n) => ({
    id: n._id,
    text: n.message,
    time: timeAgo(n.createdAt),
    type: n.type,
  }));
}
