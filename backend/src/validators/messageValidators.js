import { z } from "zod";

export const messageListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(100),
});

const attachmentSchema = z.object({
  type: z.enum(["file", "link"]),
  name: z.string().trim().min(1).optional(),
  url: z.string().trim().min(1).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1, "content is required").max(4000),
  attachments: z.array(attachmentSchema).max(10).optional().default([]),
});

export const createChannelSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(80),
  memberIds: z.array(z.string().trim().min(1)).max(500).optional().default([]),
  isDefault: z.boolean().optional().default(false),
});

export const channelMemberBodySchema = z.object({
  employeeId: z.string().trim().min(1, "employeeId is required"),
});

export const channelMemberParamsSchema = z.object({
  id: z.string().trim().min(1, "id is required"),
  employeeId: z.string().trim().min(1, "employeeId is required"),
});
