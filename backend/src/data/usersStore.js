import bcrypt from "bcryptjs";
import { employees, CURRENT_EMPLOYEE_ID } from "./employees.js";
import { generateId } from "../utils/id.js";

// Demo credentials — every seeded employee can sign in with this password.
// Change DEMO_PASSWORD in your .env (or just document a new one) before using this
// anywhere but local development.
let DEMO_PASSWORD = process.env.SEED_USER_PASSWORD || "password123";
let DEMO_PASSWORD_HASH = bcrypt.hashSync(DEMO_PASSWORD, 10);

function roleForEmployee(employee) {
  if (employee.id === "emp_005") return "admin"; // HR Director
  if (employee.role?.toLowerCase().includes("manager") || employee.role?.toLowerCase().includes("lead")) {
    return "manager";
  }
  return "employee";
}

// One auth "user" per seeded employee, linked by employeeId.
export let users = employees.map((e) => ({
  id: `user_${e.id.replace("emp_", "")}`,
  employeeId: e.id,
  name: e.name,
  email: e.email,
  passwordHash: DEMO_PASSWORD_HASH,
  role: roleForEmployee(e),
  createdAt: new Date().toISOString(),
}));

// Password reset tokens: { token, userId, expiresAt }
export let passwordResetTokens = [];

export let UsersStore = {
  findByEmail(email) {
    if (!email) return null;
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },
  findById(id) {
    return users.find((u) => u.id === id) || null;
  },
  findByEmployeeId(employeeId) {
    return users.find((u) => u.employeeId === employeeId) || null;
  },
  create({ name, email, passwordHash, employeeId, role = "employee" }) {
    let user = {
      id: generateId("user"),
      employeeId: employeeId || null,
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },
  createPasswordResetToken(userId) {
    let token = generateId("reset");
    let expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    passwordResetTokens.push({ token, userId, expiresAt });
    return token;
  },
  consumePasswordResetToken(token) {
    let entry = passwordResetTokens.find((t) => t.token === token);
    if (!entry) return null;
    passwordResetTokens = passwordResetTokens.filter((t) => t.token !== token);
    if (new Date(entry.expiresAt).getTime() < Date.now()) return null;
    return entry;
  },
  updatePassword(userId, passwordHash) {
    let user = users.find((u) => u.id === userId);
    if (!user) return null;
    user.passwordHash = passwordHash;
    return user;
  },
};

// Handy for local testing / seed logs.
export let DEFAULT_USER_EMAIL = UsersStore.findByEmployeeId(CURRENT_EMPLOYEE_ID)?.email;
export let DEMO_PASSWORD_PLAIN = DEMO_PASSWORD;
