import { EmployeeDashboard } from "../models/EmployeeDashboard.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";
import { ApiError } from "../middleware/errorHandler.js";

// No auth system yet, so :id defaults to the self-service "me" employee.
// Pass ?employeeId=emp_00X (or a /:id route param, once added) to view someone else's dashboard.
function resolveEmployeeId(req) {
  return req.params.id || req.query.employeeId || CURRENT_EMPLOYEE_ID;
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
      data: EmployeeDashboard.getAttendanceMonth(
        resolveEmployeeId(req),
        year ? Number(year) : undefined,
        month ? Number(month) : undefined
      ),
    });
  },
  getTimeline: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getTimeline(resolveEmployeeId(req)) });
  },
  getLeaveBalances: (req, res) => {
    res.json({ success: true, data: EmployeeDashboard.getLeaveBalances(resolveEmployeeId(req)) });
  },
  getUpcomingHolidays: (req, res) => {
    let { limit } = req.query;
    res.json({ success: true, data: EmployeeDashboard.getUpcomingHolidays(limit ? Number(limit) : 2) });
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
