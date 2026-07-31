import { z } from "zod";

export const dashboardLimitQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export const reportRangeQuerySchema = z.object({
  range: z.enum(["7d", "30d", "12m"]).optional().default("12m"),
  department: z.string().trim().max(120).optional(),
});

export const reportGenerateSchema = z.object({
  range: z.enum(["7d", "30d", "12m"]).optional().default("12m"),
  department: z.string().trim().max(120).optional(),
  title: z.string().trim().max(200).optional(),
});

export const attendanceMonthQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
});

export const upcomingHolidaysQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional().default(2),
});
