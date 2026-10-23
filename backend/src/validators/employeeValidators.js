

import { z } from "zod";


const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9");


export const createEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name must be at most 120 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .toLowerCase()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password is too long"),

  role: z.enum(["employee", "admin"]),

  department: z
    .string()
    .trim()
    .min(1, "Department is required")
    .max(120, "Department must be at most 120 characters"),

  phone: phoneSchema,
});
// Covers both self-edit and admin-edit; the model layer already restricts
// which of these actually get written based on who's calling (SELF_EDITABLE_FIELDS
// vs ADMIN_EDITABLE_FIELDS in models/Employee.js) — this schema just validates
// shape/format for whichever fields are present.
export const updatePersonalInfoSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120, "Name must be at most 120 characters").optional(),
    email: z.string().trim().toLowerCase().email("must be a valid email").optional(),
    phone: z.string().trim().max(40).optional(),
    // Keep in sync with the client-side compressed image size and JSON body limit.
    avatar: z.string().trim().max(100_000).optional(),
    role: z.string().trim().max(60).optional(),
    department: z.string().trim().max(120).optional(),
    employeeCode: z.string().trim().max(60).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
