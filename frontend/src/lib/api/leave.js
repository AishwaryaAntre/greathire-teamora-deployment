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

  // Employee requests cancellation of approved leave
  requestCancellation: (id) =>
    api.patch(`/leave/requests/${id}/cancel`),

  // Admin approves or rejects cancellation
  decideCancellation: (id, decision) =>
    api.patch(`/leave/requests/${id}/cancellation-decision`, {
      decision,
    }),

  approveAll: () => api.post("/leave/requests/approve-all"),

  exportCsvUrl: (params) =>
    `${API_BASE_URL}/leave/export?${new URLSearchParams(params || {}).toString()}`,
};