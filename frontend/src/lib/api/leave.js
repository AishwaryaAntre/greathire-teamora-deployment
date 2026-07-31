import { api, API_BASE_URL } from "../apiClient.js";

export const leaveApi = {
  getStats: () => api.get("/leave/stats"),
  getTeamAvailability: () => api.get("/leave/team-availability"),
  getTypes: () => api.get("/leave/types"),
  list: (params) => api.get("/leave/requests", params),
  getById: (id) => api.get(`/leave/requests/${id}`),
  create: (payload) => api.post("/leave/requests", payload),
  approve: (id) => api.patch(`/leave/requests/${id}/approve`),
  reject: (id) => api.patch(`/leave/requests/${id}/reject`),
  approveAll: () => api.post("/leave/requests/approve-all"),
  exportCsvUrl: (params) => `${API_BASE_URL}/leave/export?${new URLSearchParams(params || {}).toString()}`,
};
