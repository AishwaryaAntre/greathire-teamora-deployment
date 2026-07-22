import { UsersStore } from "../data/usersStore.js";
import { Employee } from "../models/Employee.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import { ApiError } from "../middleware/errorHandler.js";
import { generateId } from "../utils/id.js";

function toPublicUser(user) {
  let employee = user.employeeId ? Employee.getById(user.employeeId) : null;
  return {
    id: user.id,
    employeeId: user.employeeId,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: employee?.avatar || null,
    department: employee?.department || null,
    employeeCode: employee?.employeeCode || null,
  };
}

export let authController = {
  // POST /api/auth/register
  register: async (req, res) => {
    let { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      throw new ApiError(400, "name, email and password are required");
    }
    if (password.length < 8) {
      throw new ApiError(400, "Password must be at least 8 characters");
    }
    if (UsersStore.findByEmail(email)) {
      throw new ApiError(409, "An account with this email already exists");
    }

    let passwordHash = await hashPassword(password);
    let user = UsersStore.create({ name, email, passwordHash, role: "employee" });
    let token = signAccessToken({ sub: user.id, role: user.role });

    res.status(201).json({ success: true, data: { user: toPublicUser(user), token } });
  },

  // POST /api/auth/login
  login: async (req, res) => {
    let { email, password, rememberMe } = req.body || {};
    if (!email || !password) throw new ApiError(400, "email and password are required");

    let user = UsersStore.findByEmail(email);
    let valid = user ? await comparePassword(password, user.passwordHash) : false;
    if (!user || !valid) throw new ApiError(401, "Invalid email or password");

    let token = signAccessToken({ sub: user.id, role: user.role }, { rememberMe: !!rememberMe });
    res.json({ success: true, data: { user: toPublicUser(user), token } });
  },

  // POST /api/auth/logout — JWTs are stateless here, so this is a client-side no-op
  // that exists for a symmetric API surface (and a place to hang token-blacklisting later).
  logout: (req, res) => {
    res.json({ success: true, message: "Logged out" });
  },

  // GET /api/auth/me
  getMe: (req, res) => {
    let user = UsersStore.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, data: toPublicUser(user) });
  },

  // POST /api/auth/forgot-password
  forgotPassword: (req, res) => {
    let { email } = req.body || {};
    if (!email) throw new ApiError(400, "email is required");

    let user = UsersStore.findByEmail(email);
    // Always respond the same way whether or not the account exists, to avoid
    // leaking which emails are registered.
    if (user) {
      let token = UsersStore.createPasswordResetToken(user.id);
      // No email transport wired up in this in-memory backend — log it instead
      // so it's easy to grab during local development/testing.
      console.log(`[auth] Password reset requested for ${email}. Reset token: ${token}`);
    }
    res.json({ success: true, message: "If an account exists for that email, a reset link has been sent." });
  },

  // POST /api/auth/reset-password
  resetPassword: async (req, res) => {
    let { token, password } = req.body || {};
    if (!token || !password) throw new ApiError(400, "token and password are required");
    if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters");

    let entry = UsersStore.consumePasswordResetToken(token);
    if (!entry) throw new ApiError(400, "Invalid or expired reset token");

    let passwordHash = await hashPassword(password);
    UsersStore.updatePassword(entry.userId, passwordHash);
    res.json({ success: true, message: "Password has been reset. You can now sign in." });
  },

  // Called by the Google/Microsoft OAuth callback routes once passport has verified the profile.
  issueOAuthToken: (profileEmail, profileName) => {
    let user = UsersStore.findByEmail(profileEmail);
    if (!user) {
      user = UsersStore.create({
        id: generateId("user"),
        name: profileName || profileEmail,
        email: profileEmail,
        passwordHash: null,
        role: "employee",
      });
    }
    let token = signAccessToken({ sub: user.id, role: user.role });
    return { user: toPublicUser(user), token };
  },
};
