import { api } from "../apiClient.js";

export const notificationsApi = {
  list: (params) => api.get("/notifications", params),
  getSummary: () => api.get("/notifications/summary"),
  getPreferences: () => api.get("/notifications/preferences"),
  updatePreferences: (updates) => api.put("/notifications/preferences", updates),
  create: (payload) => api.post("/notifications", payload),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.post("/notifications/mark-all-read"),
};
