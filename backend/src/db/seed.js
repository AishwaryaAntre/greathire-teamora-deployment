import bcrypt from "bcryptjs";
import {
  EmployeeModel,
  UserModel,
  ChannelModel,
  DirectConversationModel,
} from "./schemas.js";
import { logger } from "../config/logger.js";

// The one account this app ships with. Log in as this admin, then add real
// employees (and message channels) from the UI — nothing else is pre-seeded.
export const CURRENT_EMPLOYEE_ID = "emp_admin";

// ---------------------------------------------------------------------------
// Employees — just the one admin account.
// ---------------------------------------------------------------------------
function buildEmployees() {
  return [
    {
      id: CURRENT_EMPLOYEE_ID,
      name: "Admin",
      role: "Administrator",
      department: "Management",
      initials: "AD",
      joiningDate: new Date().toISOString().slice(0, 10),
      avatar: null,
      employeeCode: "GH-1000",
      email: "admin@greathire.com",
      phone: null,
      performanceScore: 0,
      taskLoadPercent: 0,
      leaveAllocation: { casual: 6, paid: 12, sick: 4 },
      leaveAccrual: 0,
      documents: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Messaging — one default "General" channel so there's somewhere for newly
// created employees to land (see data/messagesStore.js#addEmployeeToDefaultChannels,
// called from Employee.create()). No demo messages or DMs.
// ---------------------------------------------------------------------------
function buildDefaultChannel(adminId) {
  return [{ id: "chan_general", name: "General", memberIds: [adminId], isDefault: true, createdBy: adminId }];
}

function roleForEmployee() {
  // Only one seeded employee, and it's always the admin.
  return "admin";
}

/**
 * Populates any collection that is still empty with the minimal starter
 * dataset (one admin employee/login + one default "General" channel). Safe
 * to call on every boot — already-seeded (or already-live) collections are
 * left untouched, so real data created by users is never overwritten.
 */
export async function seedDatabaseIfEmpty() {
  if (process.env.SEED_DEMO_DATA === "false") return;

  let employeeCount = await EmployeeModel.countDocuments();
  let employees;
  if (employeeCount === 0) {
    employees = buildEmployees();
    await EmployeeModel.insertMany(employees);
    logger.info(`[seed] inserted ${employees.length} employee (admin)`);
  } else {
    employees = await EmployeeModel.find().lean();
  }

  if ((await UserModel.countDocuments()) === 0) {
    let demoPassword = process.env.SEED_USER_PASSWORD || "password123";
    let passwordHash = bcrypt.hashSync(demoPassword, 10);
    let users = employees.map((e) => ({
      id: `user_${e.id.replace("emp_", "")}`,
      employeeId: e.id,
      name: e.name,
      email: e.email,
      passwordHash,
      role: roleForEmployee(e),
      createdAt: new Date().toISOString(),
    }));
    await UserModel.insertMany(users);
    logger.debug(`[seed] inserted ${users.length} user login (demo password: ${demoPassword})`);
  }

  if ((await ChannelModel.countDocuments()) === 0 && (await DirectConversationModel.countDocuments()) === 0) {
    let channels = buildDefaultChannel(CURRENT_EMPLOYEE_ID);
    await ChannelModel.insertMany(channels);
    logger.info(`[seed] inserted ${channels.length} default channel`);
  }

  // Everything else (attendance, activity log, leave requests, notifications,
  // announcements, holidays) is intentionally left empty — it fills in from
  // real usage instead of fake demo content.
}
