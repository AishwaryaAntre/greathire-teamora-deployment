import { EmployeeDashboard } from "../models/EmployeeDashboard.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";
import { ApiError } from "../middleware/errorHandler.js";

// Self-service routes (no :id param) always resolve to the caller's own linked
// employee. Viewing someone else's dashboard requires the :id route, which is
// gated by requireSelfOrAdmin in employeeDashboardRoutes.js — a query-string
// override here would bypass that check entirely, so it's intentionally not honored.
function resolveEmployeeId(req) {
  return req.params.id || req.user?.employeeId || CURRENT_EMPLOYEE_ID;
}

export let employeeDashboardController = {
  getCurrentUser: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getCurrentUser(resolveEmployeeId(req)) });
  },
  getCurrentStatus: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getCurrentStatus(resolveEmployeeId(req)) });
  },
  getQuickActions: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getQuickActions() });
  },
  getHoursStats: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getHoursStats(resolveEmployeeId(req)) });
  },
  getAttendanceLegend: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getAttendanceLegend() });
  },
  getAttendanceMonth: (req, res) => {
    let { year, month } = req.query;
    res.json({
      success: true,
      data: EmployeeDashboard.getAttendanceMonth(resolveEmployeeId(req), year, month),
    });
  },
  getTimeline: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getTimeline(resolveEmployeeId(req)) });
  },
  getLeaveBalances: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getLeaveBalances(resolveEmployeeId(req)) });
  },
  getUpcomingHolidays: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getUpcomingHolidays(req.query.limit) });
  },
  getQuickLinks: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getQuickLinks() });
  },
  getAttendanceSummary: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getAttendanceSummary(resolveEmployeeId(req)) });
  },
  getAnnouncement: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getAnnouncement() });
  },

  // GET /api/employee/dashboard — everything EmployeeDashboardPage.jsx needs in one call.
  getBundle: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    if (!EmployeeDashboard.getCurrentUser(employeeId)) {
      throw new ApiError(404, "Unknown employeeId");
    }
    res.json({ success: true, data: EmployeeDashboard.getBundle(employeeId) });
  },
};
