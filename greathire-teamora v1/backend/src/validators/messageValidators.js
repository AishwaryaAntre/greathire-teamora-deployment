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
