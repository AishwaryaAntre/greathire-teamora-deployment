import { z } from "zod";
import { ATTENDANCE_STATUSES } from "../models/Attendance.js";
import { DEPARTMENTS } from "../models/Employee.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format");

export const listAttendanceSchema = z.object({
  query: z.object({
    date: isoDate.optional(),
    department: z.enum(DEPARTMENTS).optional(),
    status: z.enum(ATTENDANCE_STATUSES).optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const checkInOutSchema = z.object({
  body: z.object({
    employeeId: objectId,
  }),
});

export const updateAttendanceStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      status: z.enum(ATTENDANCE_STATUSES).optional(),
      liveStatus: z.enum(["working", "on_break"]).nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
});

export const attendanceRangeSchema = z.object({
  query: z.object({
    startDate: isoDate,
    endDate: isoDate,
    department: z.enum(DEPARTMENTS).optional(),
  }),
});
