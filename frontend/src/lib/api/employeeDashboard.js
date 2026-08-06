import { api } from "../apiClient.js";

export const employeeDashboardApi = {
  getBundle: (employeeId) => api.get(employeeId ? `/employee/${employeeId}/dashboard` : "/employee/dashboard"),
  getCurrentUser: () => api.get("/employee/current-user"),
  getStatus: () => api.get("/employee/status"),
  getQuickActions: () => api.get("/employee/quick-actions"),
  getHoursStats: () => api.get("/employee/hours-stats"),
  getAttendanceLegend: () => api.get("/employee/attendance-legend"),
  getAttendanceMonth: (params) => api.get("/employee/attendance-month", params),
  // Admin-or-self gated variant for viewing a specific employee's calendar
  // (e.g. from EmployeeProfilePage.jsx) — hits /employee/:id/attendance-month,
  // NOT the self-only route above.
  getAttendanceMonthFor: (employeeId, params) => api.get(`/employee/${employeeId}/attendance-month`, params),
  getTimeline: () => api.get("/employee/timeline"),
  getLeaveBalances: () => api.get("/employee/leave-balances"),
  getUpcomingHolidays: () => api.get("/employee/upcoming-holidays"),
  getQuickLinks: () => api.get("/employee/quick-links"),
  getAttendanceSummary: () => api.get("/employee/attendance-summary"),
  getAnnouncement: () => api.get("/employee/announcement"),
};
