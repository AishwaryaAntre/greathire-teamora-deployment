import { api } from "../apiClient.js";

export const scheduleApi = {
  getMonth: (params) => api.get("/schedule/month", params),
  list: (params) => api.get("/schedule", params),
  getById: (id) => api.get(`/schedule/${id}`),
  create: (fields) => api.post("/schedule", fields),
  update: (id, fields) => api.patch(`/schedule/${id}`, fields),
  remove: (id) => api.delete(`/schedule/${id}`),
};

export const SCHEDULE_TYPE_OPTIONS = [
  { value: "task", label: "Task" },
  { value: "meeting", label: "Meeting" },
];
