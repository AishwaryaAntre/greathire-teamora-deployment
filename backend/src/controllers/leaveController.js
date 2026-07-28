import { LeaveRequest } from "../models/LeaveRequest.js";
import { ApiError } from "../middleware/errorHandler.js";
import { LEAVE_TYPE_OPTIONS } from "../data/leaveStore.js";

export let leaveController = {
  // GET /api/leave/stats
  getStats: (req, res) => {
    res.json({ success: true, data: LeaveRequest.getStatsCards() });
  },

  // GET /api/leave/team-availability
  getTeamAvailability: (req, res) => {
    res.json({ success: true, data: LeaveRequest.getTeamAvailability() });
  },

  // GET /api/leave/types
  getLeaveTypes: (req, res) => {
    res.json({ success: true, data: LEAVE_TYPE_OPTIONS });
  },

  // GET /api/leave/requests?status=&period=This%20Month&search=
  list: (req, res) => {
    let { status, period, search } = req.query;
    res.json({ success: true, data: LeaveRequest.getAll({ status, period, search }) });
  },

  // GET /api/leave/requests/:id
  getById: (req, res) => {
    let request = LeaveRequest.getById(req.params.id);
    if (!request) throw new ApiError(404, "Leave request not found");
    res.json({ success: true, data: request });
  },

  // POST /api/leave/requests  { employeeId, leaveType, startDate, endDate, reason }
  create: async (req, res) => {
    let { employeeId, leaveType, startDate, endDate, reason } = req.body;
    if (!employeeId || !leaveType || !startDate || !endDate) {
      throw new ApiError(400, "employeeId, leaveType, startDate and endDate are required");
    }
    if (new Date(endDate) < new Date(startDate)) {
      throw new ApiError(400, "endDate cannot be before startDate");
    }

    let request = await LeaveRequest.create({ employeeId, leaveType, startDate, endDate, reason });
    res.status(201).json({ success: true, data: request });
  },

  // PATCH /api/leave/requests/:id/approve
  approve: async (req, res) => {
    let request = await LeaveRequest.updateStatus(req.params.id, "Approved");
    if (!request) throw new ApiError(404, "Leave request not found");
    res.json({ success: true, data: request });
  },

  // PATCH /api/leave/requests/:id/reject
  reject: async (req, res) => {
    let request = await LeaveRequest.updateStatus(req.params.id, "Rejected");
    if (!request) throw new ApiError(404, "Leave request not found");
    res.json({ success: true, data: request });
  },

  // POST /api/leave/requests/approve-all  — "Approve All Pending" quick action
  approveAll: async (req, res) => {
    let updated = await LeaveRequest.approveAllPending();
    res.json({ success: true, data: updated, count: updated.length });
  },

  // GET /api/leave/export?status=&period=  -> CSV download
  exportCsv: (req, res) => {
    let { status, period, search } = req.query;
    let rows = LeaveRequest.getAll({ status, period, search });

    let header = "Employee,Role,Leave Type,Start Date,End Date,Duration (days),Status,Applied On\n";
    let body = rows
      .map((r) =>
        [
          r.employee?.name,
          r.employee?.role,
          r.leaveType,
          r.startDate,
          r.endDate,
          r.durationDays,
          r.status,
          r.appliedOn,
        ]
          .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="leave-requests.csv"');
    res.send(header + body);
  },
};
