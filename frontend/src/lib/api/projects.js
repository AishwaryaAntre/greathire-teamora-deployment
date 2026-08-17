import { api } from "../apiClient.js";

export const projectsApi = {
  // Admin: all projects (optionally filtered). Non-admin: only projects
  // where the caller is a team member or the project manager.
  getAll: (params) => api.get("/projects", params),
  getById: (id) => api.get(`/projects/${id}`),
  // Admin only.
  create: (fields) => api.post("/projects", fields),
  // Admin only — full field edit.
  update: (id, fields) => api.patch(`/projects/${id}`, fields),
  // Admin or the project's assigned project manager — status only.
  updateStatus: (id, status) => api.patch(`/projects/${id}/status`, { status }),
  // Admin only.
  remove: (id) => api.delete(`/projects/${id}`),
};

export const PROJECT_IMPORTANCE_OPTIONS = ["Low", "Medium", "High"];
export const PROJECT_STATUS_OPTIONS = ["Active", "Working", "Completed", "On Hold", "Cancelled"];
