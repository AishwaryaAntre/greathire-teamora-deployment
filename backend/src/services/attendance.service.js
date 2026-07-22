import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";
import { startOfDay, endOfDay } from "../utils/dates.js";
import { notifyAttendanceEvent } from "./notification.service.js";

async function findOrInitTodayRecord(employeeId) {
  const day = startOfDay(new Date());
  let record = await Attendance.findOne({ employee: employeeId, date: day });
  if (!record) {
    record = new Attendance({ employee: employeeId, date: day });
  }
  return record;
}

export async function checkIn(employeeId) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound("Employee not found");

  const record = await findOrInitTodayRecord(employeeId);
  const now = new Date();
  const nineFifteen = new Date(now);
  nineFifteen.setHours(9, 15, 0, 0);

  if (!record.checkInAt) {
    record.checkInAt = now;
    record.late = now > nineFifteen;
    record.status = record.late ? "late" : "present";
  }
  record.liveStatus = "working";
  await record.save();

  employee.status = "working";
  employee.lastActivityAt = now;
  employee.lastActivityLabel = "Checked in";
  await employee.save();

  await notifyAttendanceEvent({
    employee,
    title: "Attendance Log",
    message: `${employee.name} checked in at ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    priority: record.late ? "medium" : "normal",
  });

  return record;
}

export async function checkOut(employeeId) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound("Employee not found");

  const record = await Attendance.findOne({ employee: employeeId, date: startOfDay(new Date()) });
  if (!record || !record.checkInAt) {
    throw ApiError.badRequest("Employee has not checked in today");
  }

  const now = new Date();
  record.checkOutAt = now;
  record.liveStatus = null;
  record.hoursWorked = Math.round(((now - record.checkInAt) / 3600000) * 100) / 100;
  await record.save();

  employee.status = "offline";
  employee.lastActivityAt = now;
  employee.lastActivityLabel = "Checked out";
  await employee.save();

  await notifyAttendanceEvent({
    employee,
    title: "Attendance Log",
    message: `${employee.name} checked out at ${now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`,
    priority: "normal",
  });

  return record;
}

export async function startBreak(employeeId) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound("Employee not found");

  const record = await Attendance.findOne({ employee: employeeId, date: startOfDay(new Date()) });
  if (!record || !record.checkInAt) {
    throw ApiError.badRequest("Employee has not checked in today");
  }

  record.liveStatus = "on_break";
  record.breaks.push({ startedAt: new Date() });
  await record.save();

  employee.status = "on_break";
  employee.lastActivityAt = new Date();
  employee.lastActivityLabel = "Paused";
  await employee.save();

  await notifyAttendanceEvent({
    employee,
    title: "Break Started",
    message: `${employee.name} started a break`,
    priority: "medium",
  });

  return record;
}

export async function endBreak(employeeId) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound("Employee not found");

  const record = await Attendance.findOne({ employee: employeeId, date: startOfDay(new Date()) });
  if (!record || record.liveStatus !== "on_break") {
    throw ApiError.badRequest("Employee is not currently on a break");
  }

  const openBreak = [...record.breaks].reverse().find((b) => !b.endedAt);
  if (openBreak) openBreak.endedAt = new Date();
  record.liveStatus = "working";
  await record.save();

  employee.status = "working";
  employee.lastActivityAt = new Date();
  employee.lastActivityLabel = "Resumed work";
  await employee.save();

  await notifyAttendanceEvent({
    employee,
    title: "Break Ended",
    message: `${employee.name} resumed work`,
    priority: "normal",
  });

  return record;
}

export async function listAttendance({ date, department, status, search, page, limit }) {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });
  const day = date ? new Date(date) : new Date();
  const match = { date: { $gte: startOfDay(day), $lte: endOfDay(day) } };
  if (status) match.status = status;

  const employeeMatch = {};
  if (department) employeeMatch.department = department;
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    employeeMatch.$or = [{ name: regex }, { email: regex }, { jobTitle: regex }];
  }

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: "employees",
        localField: "employee",
        foreignField: "_id",
        as: "employee",
      },
    },
    { $unwind: "$employee" },
  ];
  if (Object.keys(employeeMatch).length) {
    pipeline.push({ $match: Object.fromEntries(Object.entries(employeeMatch).map(([k, v]) => [`employee.${k}`, v])) });
  }
  pipeline.push({ $sort: { checkInAt: -1 } });

  const countPipeline = [...pipeline, { $count: "total" }];
  const dataPipeline = [...pipeline, { $skip: skip }, { $limit: l }];

  const [rows, countResult] = await Promise.all([
    Attendance.aggregate(dataPipeline),
    Attendance.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;
  return { data: rows, meta: buildMeta({ page: p, limit: l, total }) };
}

export async function getStatsCards(date) {
  const day = date ? new Date(date) : new Date();
  const match = { date: { $gte: startOfDay(day), $lte: endOfDay(day) }, status: { $ne: "weekend" } };

  const [totalExpected, present, late, currentlyWorking] = await Promise.all([
    Attendance.countDocuments(match),
    Attendance.countDocuments({ ...match, status: { $in: ["present", "late"] } }),
    Attendance.countDocuments({ ...match, late: true }),
    Attendance.countDocuments({ ...match, liveStatus: "working" }),
  ]);

  const attendancePct = totalExpected ? Math.round((present / totalExpected) * 1000) / 10 : 0;

  return { totalExpected, present, late, currentlyWorking, attendancePct };
}

export async function updateAttendanceRecordStatus(id, { status, liveStatus }) {
  const record = await Attendance.findById(id);
  if (!record) throw ApiError.notFound("Attendance record not found");
  if (status) record.status = status;
  if (liveStatus !== undefined) record.liveStatus = liveStatus;
  await record.save();
  return record;
}

/** Raw joined rows between two dates (inclusive) — used by report aggregations. */
export async function getRange(startDate, endDate, department) {
  const match = { date: { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date(endDate)) } };
  const pipeline = [
    { $match: match },
    { $lookup: { from: "employees", localField: "employee", foreignField: "_id", as: "employee" } },
    { $unwind: "$employee" },
  ];
  if (department) pipeline.push({ $match: { "employee.department": department } });
  return Attendance.aggregate(pipeline);
}
