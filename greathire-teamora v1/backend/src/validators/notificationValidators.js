import { z } from "zod";

export const notificationListQuerySchema = z.object({
  filter: z.enum(["all", "unread", "attendance", "leave", "system"]).default("all"),
  search: z.string().trim().max(120).optional().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(100),
});

export const notificationPreferencesSchema = z.object({
  email: z.boolean().optional(),
  push: z.boolean().optional(),
  attendanceAlerts: z.boolean().optional(),
  leaveAlerts: z.boolean().optional(),
  systemAlerts: z.boolean().optional(),
});

export const notificationCreateSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  description: z.string().trim().min(1, "description is required").max(1000),
  category: z.enum(["attendance", "leave", "system"]).optional().default("system"),
  priority: z.enum(["low", "medium", "high"]).optional().default("low"),
  recipientEmployeeId: z.string().trim().min(1).optional(),
});
