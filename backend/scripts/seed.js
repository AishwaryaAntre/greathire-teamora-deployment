import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { employees } from "../src/data/employees.js";
import { users } from "../src/data/usersStore.js";
import { EmployeeModel } from "../src/schemas/employeeSchema.js";
import { UserModel } from "../src/schemas/userSchema.js";

/**
 * Explicit seed script: `npm run seed` (from backend/).
 * Upserts the current demo employees + users into MongoDB. Safe to re-run —
 * uses upsert so it won't create duplicates, and won't touch any other
 * collections (Attendance/Leave/etc. still run in-memory for now).
 *
 * Requires MONGODB_URI to be set in backend/.env — refuses to run against
 * an unconfigured (in-memory-only) setup since there'd be nothing to seed.
 */
async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is not set in backend/.env — nothing to seed.");
    process.exit(1);
  }

  let connected = await connectDB();
  if (!connected) {
    console.error("Could not connect to MongoDB. Check MONGODB_URI and try again.");
    process.exit(1);
  }

  let empOps = employees.map((e) => ({
    updateOne: { filter: { id: e.id }, update: { $set: e }, upsert: true },
  }));
  let empResult = await EmployeeModel.bulkWrite(empOps);
  console.log(`[seed] Employees — upserted: ${empResult.upsertedCount}, matched: ${empResult.matchedCount}`);

  let userOps = users.map((u) => ({
    updateOne: { filter: { id: u.id }, update: { $set: u }, upsert: true },
  }));
  let userResult = await UserModel.bulkWrite(userOps);
  console.log(`[seed] Users — upserted: ${userResult.upsertedCount}, matched: ${userResult.matchedCount}`);

  console.log("[seed] Done.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
