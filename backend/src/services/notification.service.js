import { Notification } from "../models/Notification.js";
import { NotificationPreference } from "../models/NotificationPreference.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, buildMeta } from "../utils/pagination.js";
import { startOfDay, endOfDay } from "../utils/dates.js";

export async function createNotification({ recipient = null, relatedEmployee = null, type, title, message, priority = "normal" }) {
  return Notification.create({ recipient, relatedEmployee, type, title, message, priority });
}

export async function notifyAttendanceEvent({ employee, title, message, priority }) {
  return createNotification({
    relatedEmployee: employee._id,
    type: "attendance",
    title,
    message,
    priority,
  });
}

export async function notifyLeaveEvent({ employee, title, message, priority = "normal" }) {
  return createNotification({
    relatedEmployee: employee?._id || employee,
    type: "leave",
    title,
    message,
    priority,
  });
}

export async function notifySystemEvent({ title, message, priority = "low" }) {
  return createNotification({ type: "system", title, message, priority });
}

export async function listNotifications({ filter = "all", search, page, limit }) {
  const { page: p, limit: l, skip } = parsePagination({ page, limit });
  const query = {};

  if (filter === "unread") query.isRead = false;
  else if (["attendance", "leave", "system"].includes(filter)) query.type = filter;

  if (search) {
    const regex = new RegExp(search.trim(), "i");
    query.$or = [{ title: regex }, { message: regex }];
  }

  const [data, total] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l)
      .populate("relatedEmployee", "name avatarUrl")
      .lean(),
    Notification.countDocuments(query),
  ]);

  return { data, meta: buildMeta({ page: p, limit: l, total }) };
}

export async function markAsRead(id) {
  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  if (!notification) throw ApiError.notFound("Notification not found");
  return notification;
}

export async function markAllAsRead(recipient) {
  const query = { isRead: false };
  if (recipient) query.$or = [{ recipient }, { recipient: null }];
  const result = await Notification.updateMany(query, { isRead: true, readAt: new Date() });
  return result.modifiedCount;
}

export async function getSummary() {
  const today = new Date();
  const [unread, highPriority, todayVolume] = await Promise.all([
    Notification.countDocuments({ isRead: false }),
    Notification.countDocuments({ priority: "high", isRead: false }),
    Notification.countDocuments({ createdAt: { $gte: startOfDay(today), $lte: endOfDay(today) } }),
  ]);
  return { unread, highPriority, todayVolume };
}

export async function getPreferences(userId) {
  let prefs = await NotificationPreference.findOne({ user: userId });
  if (!prefs) {
    prefs = await NotificationPreference.create({ user: userId });
  }
  return prefs;
}

export async function updatePreferences(userId, updates) {
  const prefs = await NotificationPreference.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );
  return prefs;
}
