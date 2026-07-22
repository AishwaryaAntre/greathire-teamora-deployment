import { Employee } from "../models/Employee.js";
import { Attendance } from "../models/Attendance.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";
import { startOfDay, endOfDay } from "../utils/dates.js";

const SORT_MAP = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  name_asc: { name: 1 },
  name_desc: { name: -1 },
};

async function nextEmpCode() {
  const last = await Employee.findOne().sort({ createdAt: -1 }).select("empCode").lean();
  const lastNumber = last?.empCode ? parseInt(last.empCode.replace(/\D/g, ""), 10) || 1000 : 1000;
  return `GH-${lastNumber + 1}`;
}

export async function listEmployees({ search, department, status, availability, sort, page, limit }) {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });
  const query = {};

  if (department) query.department = department;
  if (status) query.status = status;
  if (availability === "available") query.isActive = true;
  if (availability === "unavailable") query.isActive = false;
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ name: regex }, { email: regex }, { jobTitle: regex }, { empCode: regex }];
  }

  const [employees, total] = await Promise.all([
    Employee.find(query)
      .sort(SORT_MAP[sort] || SORT_MAP.newest)
      .skip(skip)
      .limit(l)
      .lean(),
    Employee.countDocuments(query),
  ]);

  const withStats = await attachTodayStats(employees);

  return { data: withStats, meta: buildMeta({ page: p, limit: l, total }) };
}

async function attachTodayStats(employees) {
  if (!employees.length) return [];
  const ids = employees.map((e) => e._id);
  const today = startOfDay(new Date());
  const tomorrow = endOfDay(new Date());

  const records = await Attendance.find({
    employee: { $in: ids },
    date: { $gte: today, $lte: tomorrow },
  }).lean();

  const byEmployee = new Map(records.map((r) => [r.employee.toString(), r]));

  return employees.map((emp) => {
    const record = byEmployee.get(emp._id.toString());
    return {
      ...emp,
      id: emp._id,
      today: record
        ? {
            hoursWorked: record.hoursWorked,
            checkInAt: record.checkInAt,
            checkOutAt: record.checkOutAt,
            liveStatus: record.liveStatus,
          }
        : { hoursWorked: 0, checkInAt: null, checkOutAt: null, liveStatus: null },
    };
  });
}

export async function getEmployeeById(id) {
  const employee = await Employee.findById(id).lean();
  if (!employee) throw ApiError.notFound("Employee not found");
  const [withStats] = await attachTodayStats([employee]);
  return withStats;
}

export async function createEmployee(payload) {
  const existing = await Employee.findOne({ email: payload.email });
  if (existing) throw ApiError.conflict("An employee with this email already exists");

  const empCode = payload.empCode || (await nextEmpCode());
  const employee = await Employee.create({ ...payload, empCode });
  return employee;
}

export async function updateEmployee(id, updates) {
  const employee = await Employee.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
  if (!employee) throw ApiError.notFound("Employee not found");
  return employee;
}

export async function updateEmployeeStatus(id, status) {
  const employee = await Employee.findByIdAndUpdate(
    id,
    { status, lastActivityAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!employee) throw ApiError.notFound("Employee not found");
  return employee;
}

export async function deleteEmployee(id) {
  const employee = await Employee.findByIdAndDelete(id);
  if (!employee) throw ApiError.notFound("Employee not found");
  return employee;
}

export async function getQuickStats() {
  const [totalEmployees, online, onBreak, onLeave, avgHoursAgg] = await Promise.all([
    Employee.countDocuments({ isActive: true }),
    Employee.countDocuments({ status: "working" }),
    Employee.countDocuments({ status: "on_break" }),
    Employee.countDocuments({ status: "on_leave" }),
    Attendance.aggregate([
      { $match: { date: { $gte: startOfDay(new Date()), $lte: endOfDay(new Date()) }, hoursWorked: { $gt: 0 } } },
      { $group: { _id: null, avgHours: { $avg: "$hoursWorked" } } },
    ]),
  ]);

  const avgHours = avgHoursAgg[0]?.avgHours || 0;
  const hours = Math.floor(avgHours);
  const minutes = Math.round((avgHours - hours) * 60);

  return {
    totalEmployees,
    onlineNow: online,
    onBreak,
    onLeave,
    avgHoursLabel: `${hours}h ${minutes}m`,
  };
}

export async function listDepartments() {
  return Employee.distinct("department");
}
