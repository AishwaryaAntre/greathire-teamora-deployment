import { z } from "zod";
import { DEPARTMENTS, EMPLOYEE_STATUSES } from "../models/Employee.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");

export const listEmployeesSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    department: z.enum(DEPARTMENTS).optional(),
    status: z.enum(EMPLOYEE_STATUSES).optional(),
    availability: z.enum(["available", "unavailable"]).optional(),
    sort: z.enum(["newest", "oldest", "name_asc", "name_desc"]).optional().default("newest"),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const employeeIdParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    jobTitle: z.string().trim().min(1, "Job title is required").max(120),
    department: z.enum(DEPARTMENTS, { errorMap: () => ({ message: "Invalid department" }) }),
    phone: z.string().trim().max(30).optional(),
    manager: objectId.optional(),
    empCode: z.string().trim().max(30).optional(),
  }),
});

export const updateEmployeeSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      jobTitle: z.string().trim().min(1).max(120).optional(),
      department: z.enum(DEPARTMENTS).optional(),
      phone: z.string().trim().max(30).optional(),
      manager: objectId.nullable().optional(),
      isActive: z.boolean().optional(),
      avatarUrl: z.string().url().nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, "At least one field is required"),
});

export const updateEmployeeStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.enum(EMPLOYEE_STATUSES),
  }),
});
