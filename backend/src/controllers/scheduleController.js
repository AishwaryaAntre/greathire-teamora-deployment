import { Schedule } from "../models/Schedule.js";
import { ApiError } from "../middleware/errorHandler.js";

function resolveEmployeeId(req) {
  return req.query.employeeId || req.user?.employeeId;
}

function canManageItem(req, item) {
  if (!item) return false;
  if (req.user?.role === "admin") return true;
  return req.user?.employeeId === item.employeeId;
}

export let scheduleController = {
  list: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    if (!employeeId) throw new ApiError(400, "employeeId is required");

    let { startDate, endDate } = req.query;
    res.json({ success: true, data: Schedule.listForEmployee(employeeId, { startDate, endDate }) });
  },

  getMonth: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    if (!employeeId) throw new ApiError(400, "employeeId is required");

    let { year, month } = req.query;
    res.json({ success: true, data: Schedule.getMonth(employeeId, year, month) });
  },

  getById: (req, res) => {
    let item = Schedule.getById(req.params.id);
    if (!item) throw new ApiError(404, "Schedule item not found");
    res.json({ success: true, data: item });
  },

  create: async (req, res) => {
    let employeeId = req.user?.employeeId;
    if (!employeeId) throw new ApiError(403, "No employee profile linked to this account");

    let item = await Schedule.create({
      ...req.body,
      employeeId,
      createdBy: req.user?.id || null,
    });
    res.status(201).json({ success: true, data: item });
  },

  update: async (req, res) => {
    let existing = Schedule.getById(req.params.id);
    if (!existing) throw new ApiError(404, "Schedule item not found");
    if (!canManageItem(req, existing)) throw new ApiError(403, "You can only edit your own schedule items");

    let item = await Schedule.update(req.params.id, req.body);
    res.json({ success: true, data: item });
  },

  remove: async (req, res) => {
    let existing = Schedule.getById(req.params.id);
    if (!existing) throw new ApiError(404, "Schedule item not found");
    if (!canManageItem(req, existing)) throw new ApiError(403, "You can only delete your own schedule items");

    await Schedule.delete(req.params.id);
    res.json({ success: true, data: { id: req.params.id } });
  },
};
