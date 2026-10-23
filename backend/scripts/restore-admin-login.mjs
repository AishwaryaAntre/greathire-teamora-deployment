import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.MONGODB_DB_NAME });
const db = mongoose.connection.db;
const users = db.collection("users");
const employees = db.collection("employees");

const passwordHash = bcrypt.hashSync(process.env.SEED_USER_PASSWORD || "password123", 10);

const userRes = await users.updateMany(
  { email: /^greathire849@gmail.com$/i },
  { $set: { email: "admin@greathire.com", passwordHash } }
);
const empRes = await employees.updateMany(
  { email: /^greathire849@gmail.com$/i },
  { $set: { email: "admin@greathire.com" } }
);

const allUsers = await users.find({}, { projection: { email: 1, name: 1, role: 1 } }).toArray();
console.log("users_updated", userRes.modifiedCount);
console.log("employees_updated", empRes.modifiedCount);
console.log("users", allUsers);
await mongoose.disconnect();
