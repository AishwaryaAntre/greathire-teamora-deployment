import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../../src/config/db.js";
import { seedDatabaseIfEmpty } from "../../src/db/seed.js";
import { loadAllData } from "../../src/db/loadAll.js";
import { createApp } from "../../src/app.js";
import { Employee } from "../../src/models/Employee.js";
import { UsersStore } from "../../src/data/usersStore.js";
import { hashPassword } from "../../src/utils/password.js";

// Keep noise out of test output; flip LOG_LEVEL if you need to debug a failure.
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "silent";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-only-secret-do-not-use-in-prod";
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

let mongod;

/** Call once per test file, in a top-level `before()`. Spins up a real (but
 * in-memory, disposable) MongoDB instance so tests exercise the actual
 * Mongoose models and data layer, not a mock of them. */
export async function setupTestApp() {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();

  await connectDB();
  await seedDatabaseIfEmpty();
  await loadAllData();

  // Seeding now only creates the one admin (see src/db/seed.js) — create the
  // fixture employees the test suite logs in as, the same way a real admin
  // would via POST /api/employees. Explicit ids (emp_001/002/003) match what
  // a couple of tests hardcode in URL paths (e.g. roles.test.js's
  // /api/employees/emp_002/...), so those don't need to change.
  let passwordHash = await hashPassword(process.env.SEED_USER_PASSWORD || "password123");
  let fixtures = [
    { id: "emp_001", name: "Leila Kabir", email: EMPLOYEE_EMAIL },
    { id: "emp_002", name: "Atul Ruia", email: EMPLOYEE_EMAIL_2 },
    { id: "emp_003", name: "Elon Musk", email: "elonmusk@greathire.com" },
  ];
  for (let { id, name, email } of fixtures) {
    let employee = await Employee.create({ id, name, email, department: "Engineering", role: "Employee" });
    await UsersStore.create({ name, email, passwordHash, employeeId: employee.id, role: "employee" });
  }

  return createApp();
}

/** Call once per test file, in a top-level `after()`. */
export async function teardownTestApp() {
  await disconnectDB();
  if (mongod) await mongod.stop();
}

/** Logs in as a seeded/fixture user and returns the Bearer token + user object.
 * The admin comes from real seed data; the two EMPLOYEE_EMAIL* accounts are
 * fixtures created by setupTestApp() above. All three share the same demo
 * password (SEED_USER_PASSWORD, default "password123"). */
export async function loginAs(request, app, email) {
  let res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: process.env.SEED_USER_PASSWORD || "password123" });
  if (res.status !== 200) {
    throw new Error(`loginAs(${email}) failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.data;
}

export const ADMIN_EMAIL = "admin@greathire.com"; // emp_admin, the one seeded account (src/db/seed.js)
export const EMPLOYEE_EMAIL = "leilakabir@greathire.com"; // emp_001 — test fixture, created in setupTestApp()
export const EMPLOYEE_EMAIL_2 = "atulruia@greathire.com"; // emp_002 — test fixture, created in setupTestApp()
