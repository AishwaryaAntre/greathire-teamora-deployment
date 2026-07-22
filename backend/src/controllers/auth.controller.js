import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import * as authService from "../services/auth.service.js";
import {
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} from "../services/token.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";

function refreshCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/api/auth", // only sent to auth endpoints that need it
  };
}

async function issueSession(res, user, { rememberMe, req }) {
  const accessToken = signAccessToken(user);
  const { rawToken, expiresAt } = await issueRefreshToken({
    user,
    rememberMe,
    userAgent: req.headers["user-agent"] || null,
    ip: req.ip,
  });

  res.cookie(REFRESH_COOKIE_NAME, rawToken, refreshCookieOptions(expiresAt));
  return accessToken;
}

// POST /api/auth/register  (assumption: admin/programmatic account creation -
// this frontend has no public sign-up form)
export const register = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, { user: user.toSafeJSON() }, "Account created"));
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await authService.loginWithPassword({ email, password });
  const accessToken = await issueSession(res, user, { rememberMe, req });

  return res.status(200).json(
    new ApiResponse(
      200,
      { user: user.toSafeJSON(), accessToken },
      "Logged in successfully"
    )
  );
});

// POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const { rawToken: newRawToken, userId, rememberMe } = await rotateRefreshToken({
    rawToken,
    userAgent: req.headers["user-agent"] || null,
    ip: req.ip,
  });

  const user = await User.findById(userId);
  if (!user || !user.isActive) {
    throw ApiError.unauthorized("Account not found or deactivated");
  }

  const accessToken = signAccessToken(user);
  const expiresAt = new Date(
    Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000
  );
  res.cookie(REFRESH_COOKIE_NAME, newRawToken, refreshCookieOptions(expiresAt));

  return res
    .status(200)
    .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  await revokeRefreshToken(rawToken);
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { user: req.user.toSafeJSON() }));
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email);
  // Always return the same generic response to avoid leaking account existence.
  return res
    .status(200)
    .json(new ApiResponse(200, null, "If that email exists, a reset link has been sent"));
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);
  return res.status(200).json(new ApiResponse(200, null, "Password has been reset"));
});
