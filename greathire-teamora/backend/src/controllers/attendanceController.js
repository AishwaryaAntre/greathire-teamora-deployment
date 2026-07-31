import { Attendance } from "../models/Attendance.js";
import { Employee } from "../models/Employee.js";
import { ApiError } from "../middleware/errorHandler.js";
import { todayISO } from "../utils/dates.js";

function todaysSummaryWithIcons(summary) {
  // Frontend maps icon components by key ("On Time" -> LogIn, "Late" -> Clock).
  return summary;
}

export let attendanceController = {
  // GET /api/attendance/stats?date=YYYY-MM-DD
  getStats: (req, res) => {
    let { date } = req.query;
    res.json({ success: true, data: Attendance.getStatsCards(date || todayISO()) });
  },

  // GET /api/attendance/live?date=&department=&status=&search=
  getLive: (req, res) => {
    let { date, department, status, search } = req.query;
    res.json({
      success: true,
      data: Attendance.getLiveTable(date || todayISO(), { department, status, search }),
    });
  },

  // GET /api/attendance/summary?date=
  getSummary: (req, res) => {
    let { date } = req.query;
    res.json({ success: true, data: todaysSummaryWithIcons(Attendance.getTodaysSummary(date || todayISO())) });
  },

  // GET /api/attendance?date=&department=&status=&search=&page=&pageSize=
  list: (req, res) => {
    let { date, department, status, search, page, pageSize } = req.query;
    let employeeId = req.user?.role !== "admin" ? req.user?.employeeId : undefined;
    let result = Attendance.list({ date, department, status, search, employeeId, page, pageSize });
    res.json({ success: true, ...result });
  },

  // GET /api/attendance/departments
  listDepartments: (req, res) => {
    res.json({ success: true, data: Employee.listDepartments() });
  },

  // POST /api/attendance/check-in — always self; correcting someone else's
  // record is a separate, admin-only action (PATCH /:id below).
  checkIn: async (req, res) => {
    let employeeId = req.user?.employeeId;
    if (!employeeId) throw new ApiError(403, "No employee profile linked to this account");

    let record = await Attendance.checkIn(employeeId);
    if (!record) throw new ApiError(404, "Employee not found");
    res.status(201).json({ success: true, data: record });
  },

  // POST /api/attendance/check-out — always self, same reasoning as check-in.
  checkOut: async (req, res) => {
    let employeeId = req.user?.employeeId;
    if (!employeeId) throw new ApiError(403, "No employee profile linked to this account");

    let record = await Attendance.checkOut(employeeId);
    if (!record) throw new ApiError(404, "No check-in record found for today");
    res.json({ success: true, data: record });
  },

  // POST /api/attendance/start-break — always self, same reasoning as check-in.
  startBreak: async (req, res) => {
    let employeeId = req.user?.employeeId;
    if (!employeeId) throw new ApiError(403, "No employee profile linked to this account");

    let record = await Attendance.startBreak(employeeId);
    if (!record) throw new ApiError(409, "You must be checked in and working to start a break");
    res.json({ success: true, data: record });
  },

  // POST /api/attendance/resume-work — always self, same reasoning as check-in.
  resumeWork: async (req, res) => {
    let employeeId = req.user?.employeeId;
    if (!employeeId) throw new ApiError(403, "No employee profile linked to this account");

    let record = await Attendance.resumeWork(employeeId);
    if (!record) throw new ApiError(409, "You must be on break to resume work");
    res.json({ success: true, data: record });
  },

  // PATCH /api/attendance/:id  { status?, liveStatus? }
  update: async (req, res) => {
    let { id } = req.params;
    let record = await Attendance.updateStatus(id, req.body);
    if (!record) throw new ApiError(404, "Attendance record not found");
    res.json({ success: true, data: record });
  },

  // GET /api/attendance/export?date=&department=&status=  -> CSV download
  exportCsv: (req, res) => {
    let { date, department, status } = req.query;
    let rows = Attendance.getByDate(date || todayISO(), { department, status });

    let header = "Name,Role,Department,Status,Check In,Check Out,Hours Worked\n";
    let body = rows
      .map((r) =>
        [
          r.employee?.name,
          r.employee?.role,
          r.employee?.department,
          r.status,
          r.checkIn || "",
          r.checkOut || "",
          r.hoursWorked || 0,
        ]
          .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="attendance-${date || todayISO()}.csv"`);
    res.send(header + body);
  },
};
