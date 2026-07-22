import { z } from "zod";
import { NOTIFICATION_TYPES } from "../models/Notification.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const listNotificationsSchema = z.object({
  query: z.object({
    filter: z.enum(["all", "unread", "attendance", "leave", "system"]).optional().default("all"),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const notificationIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createNotificationSchema = z.object({
  body: z.object({
    recipient: objectId.nullable().optional(),
    relatedEmployee: objectId.nullable().optional(),
    type: z.enum(NOTIFICATION_TYPES),
    title: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(1000),
    priority: z.enum(["low", "normal", "medium", "high"]).optional(),
  }),
});

export const updateNotificationPreferenceSchema = z.object({
  body: z.object({
    emailAlerts: z.boolean().optional(),
    attendanceAlerts: z.boolean().optional(),
    leaveAlerts: z.boolean().optional(),
    systemAlerts: z.boolean().optional(),
  }),
});
