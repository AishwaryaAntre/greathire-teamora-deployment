import { api, API_BASE_URL } from "../apiClient.js";

export const attendanceApi = {
  getStats: (date) => api.get("/attendance/stats", { date }),
  getLive: (params) => api.get("/attendance/live", params),
  getSummary: (date) => api.get("/attendance/summary", { date }),
  listDepartments: () => api.get("/attendance/departments"),
  list: (params) => api.get("/attendance", params),
  checkIn: (employeeId) => api.post("/attendance/check-in", { employeeId }),
  checkOut: (employeeId) => api.post("/attendance/check-out", { employeeId }),
  startBreak: (employeeId) => api.post("/attendance/start-break", { employeeId }),
  resumeWork: (employeeId) => api.post("/attendance/resume-work", { employeeId }),
  update: (id, updates) => api.patch(`/attendance/${id}`, updates),
  exportCsvUrl: (params) => `${API_BASE_URL}/attendance/export?${new URLSearchParams(params || {}).toString()}`,
};
