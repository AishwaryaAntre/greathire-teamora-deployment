import { UsersStore } from "../data/usersStore.js";
import { RefreshTokenStore } from "../data/refreshTokenStore.js";
import { Employee } from "../models/Employee.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signAccessToken } from "../utils/jwt.js";
import { ApiError } from "../middleware/errorHandler.js";
import { logger } from "../config/logger.js";

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
    let { name, email, password } = req.body;
    if (await UsersStore.findByEmail(email)) {
      throw new ApiError(409, "An account with this email already exists");
    }

    let passwordHash = await hashPassword(password);
    let user = await UsersStore.create({ name, email, passwordHash, role: "employee" });
    let token = signAccessToken({ sub: user.id, role: user.role });
    let refreshToken = await RefreshTokenStore.issue(user.id, { rememberMe: false });

    res.status(201).json({ success: true, data: { user: toPublicUser(user), token, refreshToken } });
  },

  // POST /api/auth/login
  login: async (req, res) => {
    let { email, password, rememberMe } = req.body;

    let user = await UsersStore.findByEmail(email);
    let valid = user ? await comparePassword(password, user.passwordHash) : false;
    if (!user || !valid) throw new ApiError(401, "Invalid email or password");

    let token = signAccessToken({ sub: user.id, role: user.role }, { rememberMe: !!rememberMe });
    let refreshToken = await RefreshTokenStore.issue(user.id, { rememberMe: !!rememberMe });
    res.json({ success: true, data: { user: toPublicUser(user), token, refreshToken } });
  },

  // POST /api/auth/refresh — exchanges a valid refresh token for a new access
  // token + a rotated refresh token. The old refresh token is revoked the
  // instant it's used, so it can't be replayed.
  refresh: async (req, res) => {
    let { refreshToken } = req.body;

    let rotated = await RefreshTokenStore.rotate(refreshToken);
    if (!rotated) throw new ApiError(401, "Invalid or expired refresh token. Please log in again.");

    let user = await UsersStore.findById(rotated.userId);
    if (!user) throw new ApiError(401, "Invalid or expired refresh token. Please log in again.");

    let token = signAccessToken({ sub: user.id, role: user.role });
    res.json({ success: true, data: { user: toPublicUser(user), token, refreshToken: rotated.rawToken } });
  },

  // POST /api/auth/logout — revokes the refresh token that's presented (if any),
  // so it can't be used to mint new access tokens after the user signs out.
  // The short-lived access token itself is stateless and just expires naturally.
  logout: async (req, res) => {
    let { refreshToken } = req.body;
    if (refreshToken) await RefreshTokenStore.revoke(refreshToken);
    res.json({ success: true, message: "Logged out" });
  },

  // GET /api/auth/me
  getMe: async (req, res) => {
    let user = await UsersStore.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, data: toPublicUser(user) });
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (req, res) => {
    let { email } = req.body;

    let user = await UsersStore.findByEmail(email);
    // Always respond the same way whether or not the account exists, to avoid
    // leaking which emails are registered.
    if (user) {
      let token = await UsersStore.createPasswordResetToken(user.id);
      // No email transport wired up yet — log it instead so it's easy to grab
      // during local development/testing.
      logger.debug({ email }, `[auth] Password reset requested. Reset token: ${token}`);
    }
    res.json({ success: true, message: "If an account exists for that email, a reset link has been sent." });
  },

  // POST /api/auth/reset-password
  resetPassword: async (req, res) => {
    let { token, password } = req.body;

    let entry = await UsersStore.consumePasswordResetToken(token);
    if (!entry) throw new ApiError(400, "Invalid or expired reset token");

    let passwordHash = await hashPassword(password);
    await UsersStore.updatePassword(entry.userId, passwordHash);
    await RefreshTokenStore.revokeAllForUser(entry.userId);
    res.json({ success: true, message: "Password has been reset. You can now sign in." });
  },

  // Called by the Google/Microsoft OAuth callback routes once passport has verified the profile.
  issueOAuthToken: async (profileEmail, profileName) => {
    let user = await UsersStore.findByEmail(profileEmail);
    if (!user) {
      user = await UsersStore.create({
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
