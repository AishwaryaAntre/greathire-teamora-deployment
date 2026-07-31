import { api } from "../apiClient.js";

export const dashboardApi = {
  getAll: () => api.get("/dashboard"),
  getOverview: () => api.get("/dashboard/overview"),
  getSnapshot: () => api.get("/dashboard/snapshot"),
  getMetrics: () => api.get("/dashboard/metrics"),
  getLiveWorkforce: () => api.get("/dashboard/live-workforce"),
  getRecentActivity: () => api.get("/dashboard/activity"),
};
