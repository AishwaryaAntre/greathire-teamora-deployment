import { api } from "../apiClient.js";

export const employeeProfileApi = {
  getBundle: (employeeId) => api.get(employeeId ? `/employees/${employeeId}/profile/bundle` : "/employees/profile/bundle"),
  getProfile: () => api.get("/employees/profile"),
  getStatCards: () => api.get("/employees/profile/stat-cards"),
  getWorkSummary: () => api.get("/employees/profile/work-summary"),
  getActivityMap: () => api.get("/employees/profile/activity-map"),
  getPersonalInfo: () => api.get("/employees/profile/personal-info"),
  updatePersonalInfo: (updates) => api.put("/employees/profile/personal-info", updates),
  getDocuments: () => api.get("/employees/profile/documents"),
};
