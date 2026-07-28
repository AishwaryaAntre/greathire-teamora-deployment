import { api } from "../apiClient.js";

export const reportsApi = {
  getStats: (params) => api.get("/reports/stats", params),
  getAttendanceTrends: (params) => api.get("/reports/attendance-trends", params),
  getWorkingHours: (params) => api.get("/reports/working-hours", params),
  listDepartments: () => api.get("/reports/departments"),
  listGenerated: () => api.get("/reports"),
  generate: (payload) => api.post("/reports/generate", payload),
};
