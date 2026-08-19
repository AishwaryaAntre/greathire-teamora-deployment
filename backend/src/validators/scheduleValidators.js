import { z } from "zod";
import { SCHEDULE_STATUS_OPTIONS, SCHEDULE_TYPE_OPTIONS } from "../data/scheduleStore.js";

const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a YYYY-MM-DD date");
const clockTime = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "must be HH:mm")
  .optional()
  .nullable();

export const scheduleMonthQuerySchema = z.object({
  employeeId: z.string().trim().min(1).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  month: z.coerce.number().int().min(0).max(11).optional(),
});

export const scheduleListQuerySchema = z.object({
  employeeId: z.string().trim().min(1).optional(),
  startDate: isoDate.optional(),
  endDate: isoDate.optional(),
});

export const scheduleCreateSchema = z
  .object({
    type: z.enum(SCHEDULE_TYPE_OPTIONS),
    title: z.string().trim().min(1, "title is required").max(200),
    description: z.string().trim().max(2000).optional(),
    date: isoDate,
    startTime: clockTime,
    endTime: clockTime,
    location: z.string().trim().max(300).optional(),
    participantIds: z.array(z.string().trim().min(1)).optional(),
    projectId: z.string().trim().min(1).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "meeting" && !data.startTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "startTime is required for meetings", path: ["startTime"] });
    }
    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "endTime must be after startTime", path: ["endTime"] });
    }
  });

export const scheduleUpdateSchema = z
  .object({
    type: z.enum(SCHEDULE_TYPE_OPTIONS).optional(),
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    date: isoDate.optional(),
    startTime: clockTime,
    endTime: clockTime,
    location: z.string().trim().max(300).optional(),
    participantIds: z.array(z.string().trim().min(1)).optional(),
    projectId: z.string().trim().min(1).optional().nullable(),
    status: z.enum(SCHEDULE_STATUS_OPTIONS).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime && data.endTime <= data.startTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "endTime must be after startTime", path: ["endTime"] });
    }
  });
