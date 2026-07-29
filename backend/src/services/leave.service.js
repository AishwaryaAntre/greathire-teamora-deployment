import { LeaveRequest } from "../models/LeaveRequest.js";
import { Employee } from "../models/Employee.js";
import { Attendance } from "../models/Attendance.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";
import { daysBetweenInclusive, isSameMonth, isLastMonth, startOfDay, endOfDay } from "../utils/dates.js";
import { notifyLeaveEvent } from "./notification.service.js";

export async function listLeaveRequests({ status, period, search, page, limit }) {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });
  const match = {};
  if (status) match.status = status;

  const pipeline = [
    { $match: match },
    { $lookup: { from: "employees", localField: "employee", foreignField: "_id", as: "employee" } },
    { $unwind: "$employee" },
  ];
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    pipeline.push({ $match: { $or: [{ "employee.name": regex }, { "employee.email": regex }] } });
  }
  pipeline.push({ $sort: { appliedOn: -1 } });

  let rows = await LeaveRequest.aggregate(pipeline);

  if (period === "this_month") rows = rows.filter((r) => isSameMonth(r.startDate));
  else if (period === "last_month") rows = rows.filter((r) => isLastMonth(r.startDate));

  const total = rows.length;
  const data = rows.slice(skip, skip + l);

  return { data, meta: buildMeta({ page: p, limit: l, total }) };
}

export async function getLeaveById(id) {
  const request = await LeaveRequest.findById(id).populate("employee", "name email avatarUrl department");
  if (!request) throw ApiError.notFound("Leave request not found");
  return request;
}

export async function createLeaveRequest({ employeeId, leaveType, startDate, endDate, reason }) {
  const employee = await Employee.findById(employeeId);
  if (!employee) throw ApiError.notFound("Employee not found");

  const durationDays = daysBetweenInclusive(startDate, endDate);
  const request = await LeaveRequest.create({
    employee: employeeId,
    leaveType,
    startDate,
    endDate,
    durationDays,
    reason,
  });

  await notifyLeaveEvent({
    employee,
    title: "Leave Requested",
    message: `${employee.name} applied for ${leaveType.toLowerCase()} from ${startDate} to ${endDate}`,
    priority: "medium",
  });

  return request;
}

export async function decideLeaveRequest(id, { status, decisionNote, decidedBy }) {
  const request = await LeaveRequest.findById(id).populate("employee");
  if (!request) throw ApiError.notFound("Leave request not found");
  if (request.status !== "pending") {
    throw ApiError.badRequest("This leave request has already been decided");
  }

  request.status = status;
  request.decidedOn = new Date();
  request.decisionNote = decisionNote || "";
  request.decidedBy = decidedBy || null;
  await request.save();

  if (status === "approved") {
    const today = startOfDay(new Date());
    if (request.startDate <= endOfDay(new Date()) && request.endDate >= today) {
      await Employee.findByIdAndUpdate(request.employee._id, { status: "on_leave" });
    }
  }

  await notifyLeaveEvent({
    employee: request.employee,
    title: `Leave ${status === "approved" ? "Approved" : "Rejected"}`,
    message: `${request.employee.name}'s ${request.leaveType.toLowerCase()} request was ${status}`,
    priority: "normal",
  });

  return request;
}

export async function getStatsCards() {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  const [pending, approvedToday, onLeaveToday] = await Promise.all([
    LeaveRequest.countDocuments({ status: "pending" }),
    LeaveRequest.countDocuments({ status: "approved", decidedOn: { $gte: today, $lte: tomorrow } }),
    LeaveRequest.countDocuments({ status: "approved", startDate: { $lte: tomorrow }, endDate: { $gte: today } }),
  ]);

  return { pending, approvedToday, onLeaveToday };
}

export async function getTeamAvailability() {
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  const totalEmployees = await Employee.countDocuments({ isActive: true });
  const onLeaveEmployeeIds = await LeaveRequest.find({
    status: "approved",
    startDate: { $lte: tomorrow },
    endDate: { $gte: today },
  }).distinct("employee");

  const sickLeaveIds = await LeaveRequest.find({
    status: "approved",
    leaveType: "Sick Leave",
    startDate: { $lte: tomorrow },
    endDate: { $gte: today },
  }).distinct("employee");

  const onLeave = onLeaveEmployeeIds.length;
  const sick = sickLeaveIds.length;
  const working = Math.max(totalEmployees - onLeave, 0);

  return { working, onLeave: onLeave - sick, sickLeave: sick };
}

export async function approveAllPending(decidedBy) {
  const pending = await LeaveRequest.find({ status: "pending" }).populate("employee");
  const results = [];
  for (const request of pending) {
    request.status = "approved";
    request.decidedOn = new Date();
    request.decidedBy = decidedBy || null;
    await request.save();
    results.push(request);
  }
  return results;
}
