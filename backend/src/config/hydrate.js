import mongoose from "mongoose";
import { employees, departments } from "../data/employees.js";
import { users } from "../data/usersStore.js";
import { EmployeeModel } from "../schemas/employeeSchema.js";
import { UserModel } from "../schemas/userSchema.js";

/**
 * Loads Employee + User data from MongoDB into the existing in-memory arrays
 * that the rest of the app already reads synchronously (Employee.getById,
 * UsersStore.findByEmail, etc.) — this keeps every existing call site working
 * completely unchanged while the underlying data is now DB-backed.
 *
 * On a fresh/empty database, it seeds MongoDB from the current in-memory
 * demo data first, so `npm run dev` still works out of the box.
 *
 * No-ops entirely if MongoDB isn't connected (falls back to pure in-memory,
 * same as before this feature existed).
 */
export async function hydrateFromDb() {
  if (mongoose.connection.readyState !== 1) return;

  let empCount = await EmployeeModel.countDocuments();
  if (empCount === 0 && employees.length > 0) {
    await EmployeeModel.insertMany(employees.map((e) => ({ ...e })));
    console.log(`[db] Seeded ${employees.length} employees into MongoDB`);
  }
  let dbEmployees = await EmployeeModel.find().lean();
  employees.length = 0;
  employees.push(...dbEmployees);

  departments.length = 0;
  departments.push(...new Set(employees.map((e) => e.department)));

  let userCount = await UserModel.countDocuments();
  if (userCount === 0 && users.length > 0) {
    await UserModel.insertMany(users.map((u) => ({ ...u })));
    console.log(`[db] Seeded ${users.length} users into MongoDB`);
  }
  let dbUsers = await UserModel.find().lean();
  users.length = 0;
  users.push(...dbUsers);

  console.log(`[db] Hydrated ${employees.length} employees and ${users.length} users from MongoDB`);
}
