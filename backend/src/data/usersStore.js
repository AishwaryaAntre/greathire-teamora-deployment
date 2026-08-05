import { UserModel, PasswordResetTokenModel } from "../db/schemas.js";
import { generateId } from "../utils/id.js";

// Demo credentials — every seeded employee can sign in with this password.
// Change SEED_USER_PASSWORD in your .env before using this anywhere but local dev.
export const DEMO_PASSWORD_PLAIN = process.env.SEED_USER_PASSWORD || "password123";

function strip(doc) {
  if (!doc) return null;
  let { _id, ...rest } = doc;
  return rest;
}

/** All reads/writes go straight to MongoDB — auth data is small and low-traffic
 * enough that an in-memory cache isn't worth the staleness risk. */
export const UsersStore = {
  async findByEmail(email) {
    if (!email) return null;
    return strip(await UserModel.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") }).lean());
  },
  async findById(id) {
    return strip(await UserModel.findOne({ id }).lean());
  },
  async findByEmployeeId(employeeId) {
    return strip(await UserModel.findOne({ employeeId }).lean());
  },
  async create({ name, email, passwordHash, employeeId, role = "employee" }) {
    let user = {
      id: generateId("user"),
      employeeId: employeeId || null,
      name,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
    };
    await UserModel.create(user);
    return user;
  },
  async createPasswordResetToken(userId) {
    let token = generateId("reset");
    let expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    await PasswordResetTokenModel.create({ token, userId, expiresAt });
    return token;
  },
  async consumePasswordResetToken(token) {
    let entry = await PasswordResetTokenModel.findOne({ token }).lean();
    if (!entry) return null;
    await PasswordResetTokenModel.deleteOne({ token });
    if (new Date(entry.expiresAt).getTime() < Date.now()) return null;
    return entry;
  },
  async updatePassword(userId, passwordHash) {
    let user = await UserModel.findOneAndUpdate({ id: userId }, { $set: { passwordHash } }, { new: true }).lean();
    return strip(user);
  },
  /** Removes the login account tied to a deleted employee, so it can no
   * longer be used to sign in. */
  async deleteByEmployeeId(employeeId) {
    await UserModel.deleteOne({ employeeId });
  },
};

/** Handy for local testing / seed logs — resolved lazily since it needs a DB round trip. */
export async function getDefaultUserEmail(currentEmployeeId) {
  let user = await UsersStore.findByEmployeeId(currentEmployeeId);
  return user?.email;
}
