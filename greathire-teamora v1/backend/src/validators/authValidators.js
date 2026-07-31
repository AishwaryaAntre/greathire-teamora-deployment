import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  email: z.string().trim().toLowerCase().email("must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("must be a valid email"),
  password: z.string().min(1, "password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const refreshSchema = z.object({
  refreshToken: z.string().trim().min(1, "refreshToken is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().trim().min(1).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("must be a valid email"),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1, "token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});
