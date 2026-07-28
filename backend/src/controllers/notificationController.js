import { Notification } from "../models/Notification.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";
import { ApiError } from "../middleware/errorHandler.js";

// Uses the authenticated user's linked employee if a token was sent, otherwise
// falls back to the seeded CURRENT_EMPLOYEE_ID so the endpoints work standalone.
function resolveEmployeeId(req) {
  return req.user?.employeeId || CURRENT_EMPLOYEE_ID;
}

export let notificationController = {
  list: (req, res) => {
    let { filter = "all", search = "" } = req.query;
    let data = Notification.list(resolveEmployeeId(req), { filter, search });
    res.json({ success: true, data });
  },

  getSummary: (req, res) => {
    res.json({ success: true, data: Notification.getSummary(resolveEmployeeId(req)) });
  },

  getPreferences: (req, res) => {
    res.json({ success: true, data: Notification.getPreferences(resolveEmployeeId(req)) });
  },

  updatePreferences: async (req, res) => {
    let data = await Notification.updatePreferences(resolveEmployeeId(req), req.body || {});
    res.json({ success: true, data });
  },

  create: async (req, res) => {
    let { title, description, category, priority, recipientEmployeeId } = req.body || {};
    if (!title || !description) throw new ApiError(400, "title and description are required");
    let data = await Notification.create({
      title,
      description,
      category,
      priority,
      recipientEmployeeId: recipientEmployeeId || resolveEmployeeId(req),
    });
    res.status(201).json({ success: true, data });
  },

  markAsRead: async (req, res) => {
    let data = await Notification.markAsRead(req.params.id, resolveEmployeeId(req));
    if (!data) throw new ApiError(404, "Notification not found");
    res.json({ success: true, data });
  },

  markAllAsRead: async (req, res) => {
    let count = await Notification.markAllAsRead(resolveEmployeeId(req));
    res.json({ success: true, data: { updated: count } });
  },
};
