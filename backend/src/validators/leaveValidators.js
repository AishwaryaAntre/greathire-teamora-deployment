import { z } from "zod";
import { LEAVE_TYPE_OPTIONS, LEAVE_STATUS_OPTIONS } from "../data/leaveStore.js";

const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a YYYY-MM-DD date");

export const leaveListQuerySchema = z.object({
  status: z.enum([...LEAVE_STATUS_OPTIONS, "All"]).optional(),
  period: z.enum(["This Month", "Last Month"]).optional(),
  search: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(100),
});

export const leaveFilterQuerySchema = z.object({
  status: z.enum([...LEAVE_STATUS_OPTIONS, "All"]).optional(),
  period: z.enum(["This Month", "Last Month"]).optional(),
  search: z.string().trim().max(120).optional(),
});

export const leaveCreateSchema = z
  .object({
    leaveType: z.enum(LEAVE_TYPE_OPTIONS, { message: `leaveType must be one of: ${LEAVE_TYPE_OPTIONS.join(", ")}` }),
    startDate: isoDate,
    endDate: isoDate,
    reason: z.string().trim().max(500).optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "endDate cannot be before startDate",
    path: ["endDate"],
  });
