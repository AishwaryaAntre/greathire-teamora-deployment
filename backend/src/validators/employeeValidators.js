import { z } from "zod";

export const createEmployeeSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(120),
  email: z.string().trim().toLowerCase().email("must be a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  role: z.enum(["employee", "admin"]).optional().default("employee"),
  department: z.string().trim().max(120).optional(),
  phone: z.string().trim().max(40).optional(),
});

// Covers both self-edit and admin-edit; the model layer already restricts
// which of these actually get written based on who's calling (SELF_EDITABLE_FIELDS
// vs ADMIN_EDITABLE_FIELDS in models/Employee.js) — this schema just validates
// shape/format for whichever fields are present.
export const updatePersonalInfoSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().toLowerCase().email("must be a valid email").optional(),
    phone: z.string().trim().max(40).optional(),
    avatar: z.string().trim().max(2000).optional(),
    role: z.string().trim().max(60).optional(),
    department: z.string().trim().max(120).optional(),
    employeeCode: z.string().trim().max(60).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
