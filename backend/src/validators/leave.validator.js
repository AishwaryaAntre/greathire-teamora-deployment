import { z } from "zod";
import { LEAVE_TYPES, LEAVE_STATUSES } from "../models/LeaveRequest.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format");

export const listLeaveSchema = z.object({
  query: z.object({
    status: z.enum(LEAVE_STATUSES).optional(),
    period: z.enum(["this_month", "last_month", "all"]).optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const leaveIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createLeaveSchema = z.object({
  body: z.object({
    employeeId: objectId,
    leaveType: z.enum(LEAVE_TYPES, { errorMap: () => ({ message: "Invalid leave type" }) }),
    startDate: isoDate,
    endDate: isoDate,
    reason: z.string().trim().max(1000).optional().default(""),
  }),
});

export const decideLeaveSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(["approved", "rejected"]),
    decisionNote: z.string().trim().max(500).optional().default(""),
  }),
});
