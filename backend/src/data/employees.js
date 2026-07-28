import { EmployeeModel } from "../db/schemas.js";
import { CURRENT_EMPLOYEE_ID } from "../db/seed.js";

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

/** Allows editing a handful of self-service-safe fields (name, email, phone, avatar).
 * Mutates the in-memory cache and persists the same change to MongoDB. */
export async function persistEmployeeUpdate(id, updates = {}) {
  let employee = employees.find((e) => e.id === id);
  if (!employee) return null;

  let allowed = ["name", "email", "phone", "avatar"];
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

export { CURRENT_EMPLOYEE_ID };
