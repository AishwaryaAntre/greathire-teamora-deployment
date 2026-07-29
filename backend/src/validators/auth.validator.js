import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional().default(false),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
  }),
});
