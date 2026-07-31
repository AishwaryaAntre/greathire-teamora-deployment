import { z } from "zod";

const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be a YYYY-MM-DD date")
  .optional();

export const attendanceListQuerySchema = z.object({
  date: isoDate,
  department: z.string().trim().max(120).optional(),
  status: z.string().trim().max(40).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const attendanceDateFilterQuerySchema = z.object({
  date: isoDate,
  department: z.string().trim().max(120).optional(),
  status: z.string().trim().max(40).optional(),
  search: z.string().trim().max(120).optional(),
});

export const attendanceUpdateSchema = z
  .object({
    status: z.enum(["Present", "Late", "Absent", "Weekend"]).optional(),
    liveStatus: z.enum(["Working", "On Break"]).nullable().optional(),
  })
  .refine((data) => data.status !== undefined || data.liveStatus !== undefined, {
    message: "At least one of status or liveStatus is required",
  });
