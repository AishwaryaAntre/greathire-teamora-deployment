import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "../../src/config/db.js";
import { seedDatabaseIfEmpty } from "../../src/db/seed.js";
import { loadAllData } from "../../src/db/loadAll.js";
import { createApp } from "../../src/app.js";

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

  return createApp();
}

/** Call once per test file, in a top-level `after()`. */
export async function teardownTestApp() {
  await disconnectDB();
  if (mongod) await mongod.stop();
}

/** Logs in as a seeded demo user and returns the Bearer token + user object.
 * Every seeded employee shares the same password (SEED_USER_PASSWORD, default
 * "password123" — see src/db/seed.js). Email is derived from the employee's
 * name, e.g. "Rajiv Singh" -> "rajivsingh@greathire.com". */
export async function loginAs(request, app, email) {
  let res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: process.env.SEED_USER_PASSWORD || "password123" });
  if (res.status !== 200) {
    throw new Error(`loginAs(${email}) failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body.data;
}

export const ADMIN_EMAIL = "rajivsingh@greathire.com"; // emp_005, seeded as role: admin
export const EMPLOYEE_EMAIL = "leilakabir@greathire.com"; // emp_001, seeded as role: employee
export const EMPLOYEE_EMAIL_2 = "atulruia@greathire.com"; // emp_002, seeded as role: employee
