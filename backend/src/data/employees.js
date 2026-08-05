import { EmployeeModel } from "../db/schemas.js";
import { CURRENT_EMPLOYEE_ID } from "../db/seed.js";
import { generateId } from "../utils/id.js";

/** Module-level cache, kept in sync with MongoDB. Populated by loadEmployees()
 * at boot; every mutation below writes through to Mongo AND updates this array
 * so the rest of the app (which was written against a synchronous in-memory
 * array) keeps working unchanged. */
export let employees = [];
export let departments = [];

function recomputeDepartments() {
  departments.length = 0;
  departments.push(...new Set(employees.map((e) => e.department)));
}

/** Loads every employee from MongoDB into the in-memory cache. Call at boot
 * (after seeding) and any time the underlying collection changes externally. */
export async function loadEmployees() {
  let docs = await EmployeeModel.find().lean();
  employees.length = 0;
  employees.push(...docs.map(({ _id, ...rest }) => rest));
  recomputeDepartments();
  return employees;
}

/** Allows editing employee fields. `allowed` defaults to the self-service-safe
 * subset; admins may pass the full editable field set. Mutates the in-memory
 * cache and persists the same change to MongoDB. */
export async function persistEmployeeUpdate(id, updates = {}, allowed = ["name", "email", "phone", "avatar"]) {
  let employee = employees.find((e) => e.id === id);
  if (!employee) return null;

  let patch = {};
  for (let key of allowed) {
    if (updates[key] !== undefined) {
      employee[key] = updates[key];
      patch[key] = updates[key];
    }
  }
  if (Object.keys(patch).length) {
    await EmployeeModel.updateOne({ id }, { $set: patch });
  }
  return employee;
}

/** Admin-only: creates a brand-new employee record. */
export async function createEmployee({ name, email, role, department, phone }) {
  let employee = {
    id: generateId("emp"),
    name,
    email: email || null,
    phone: phone || null,
    role: role || "Employee",
    department: department || "Unassigned",
    initials: (name || "?")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    joiningDate: new Date().toISOString().slice(0, 10),
    avatar: null,
    employeeCode: `EMP-${employees.length + 1001}`,
    performanceScore: 0,
    taskLoadPercent: 0,
    leaveAllocation: { casual: 12, paid: 12, sick: 8 },
    documents: [],
  };
  await EmployeeModel.create(employee);
  employees.push(employee);
  recomputeDepartments();
  return employee;
}

/** Admin-only: permanently removes an employee record from the cache + MongoDB. */
export async function deleteEmployee(id) {
  let index = employees.findIndex((e) => e.id === id);
  if (index === -1) return false;
  employees.splice(index, 1);
  await EmployeeModel.deleteOne({ id });
  recomputeDepartments();
  return true;
}

export { CURRENT_EMPLOYEE_ID };
