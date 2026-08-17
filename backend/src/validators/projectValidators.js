import { z } from "zod";
import { PROJECT_IMPORTANCE_OPTIONS, PROJECT_STATUS_OPTIONS } from "../data/projectsStore.js";

const isoDate = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "must be a YYYY-MM-DD date");

export const projectListQuerySchema = z.object({
  status: z.enum([...PROJECT_STATUS_OPTIONS, "All"]).optional(),
  importance: z.enum([...PROJECT_IMPORTANCE_OPTIONS, "All"]).optional(),
  search: z.string().trim().max(120).optional(),
});

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(150),
  description: z.string().trim().max(2000).optional(),
  teamMemberIds: z.array(z.string().trim().min(1)).default([]),
  projectManagerId: z.string().trim().min(1).optional().nullable(),
  endDate: isoDate,
  importance: z.enum(PROJECT_IMPORTANCE_OPTIONS, {
    message: `importance must be one of: ${PROJECT_IMPORTANCE_OPTIONS.join(", ")}`,
  }),
  status: z
    .enum(PROJECT_STATUS_OPTIONS, {
      message: `status must be one of: ${PROJECT_STATUS_OPTIONS.join(", ")}`,
    })
    .default("Active"),
});

// Admin full-edit — same shape as create, but every field optional since it's a PATCH.
export const projectUpdateSchema = z.object({
  name: z.string().trim().min(1).max(150).optional(),
  description: z.string().trim().max(2000).optional(),
  teamMemberIds: z.array(z.string().trim().min(1)).optional(),
  projectManagerId: z.string().trim().min(1).optional().nullable(),
  endDate: isoDate.optional(),
  importance: z.enum(PROJECT_IMPORTANCE_OPTIONS).optional(),
  status: z.enum(PROJECT_STATUS_OPTIONS).optional(),
});

// Project-manager restricted edit — status only (progress/completion tracking).
export const projectStatusUpdateSchema = z.object({
  status: z.enum(PROJECT_STATUS_OPTIONS, {
    message: `status must be one of: ${PROJECT_STATUS_OPTIONS.join(", ")}`,
  }),
});
