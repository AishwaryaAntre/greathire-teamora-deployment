import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as notificationService from "../services/notification.service.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const { data, meta } = await notificationService.listNotifications(req.query);
  return res.status(200).json(new ApiResponse(200, { notifications: data, meta }));
});

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await notificationService.getSummary();
  return res.status(200).json(new ApiResponse(200, { summary }));
});

export const createNotification = asyncHandler(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  return res.status(201).json(new ApiResponse(201, { notification }, "Notification created"));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id);
  return res.status(200).json(new ApiResponse(200, { notification }, "Marked as read"));
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const count = await notificationService.markAllAsRead(req.user?._id);
  return res.status(200).json(new ApiResponse(200, { updated: count }, "All notifications marked as read"));
});

export const getPreferences = asyncHandler(async (req, res) => {
  const preferences = await notificationService.getPreferences(req.user._id);
  return res.status(200).json(new ApiResponse(200, { preferences }));
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const preferences = await notificationService.updatePreferences(req.user._id, req.body);
  return res.status(200).json(new ApiResponse(200, { preferences }, "Preferences updated"));
});
