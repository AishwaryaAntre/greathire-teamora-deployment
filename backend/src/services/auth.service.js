import crypto from "node:crypto";
import { User } from "../models/User.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { ApiError } from "../utils/ApiError.js";
import { hashToken } from "./token.service.js";
import { sendPasswordResetEmail } from "./email.service.js";
import { env } from "../config/env.js";
import ms from "../utils/ms.js";

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict("An account with this email already exists");
  }

  const user = new User({ name, email, authProviders: ["local"] });
  await user.setPassword(password);
  await user.save();
  return user;
}

export async function loginWithPassword({ email, password }) {
  const user = await User.findOne({ email }).select("+passwordHash");

  // Use a generic message so we don't leak whether the email exists.
  if (!user || !user.authProviders.includes("local")) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("This account has been deactivated. Contact your administrator.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  return user;
}

export async function findOrCreateOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  const idField = provider === "google" ? "googleId" : "microsoftId";

  let user = await User.findOne({ [idField]: providerId }).select(`+${idField}`);

  if (!user) {
    user = await User.findOne({ email });
  }

  if (user) {
    if (!user.isActive) {
      throw ApiError.forbidden("This account has been deactivated. Contact your administrator.");
    }
    if (!user[idField]) user[idField] = providerId;
    if (!user.authProviders.includes(provider)) user.authProviders.push(provider);
    if (!user.avatarUrl && avatarUrl) user.avatarUrl = avatarUrl;
    user.lastLoginAt = new Date();
    await user.save();
    return user;
  }

  user = new User({
    name,
    email,
    avatarUrl: avatarUrl || null,
    authProviders: [provider],
    [idField]: providerId,
    lastLoginAt: new Date(),
  });
  await user.save();
  return user;
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });

  // Always behave the same whether or not the user exists, to avoid
  // leaking account existence via response timing/content.
  if (!user || !user.authProviders.includes("local")) {
    return;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + ms(`${env.passwordReset.expiresMin}m`));

  await PasswordResetToken.create({ user: user._id, tokenHash, expiresAt });

  const resetUrl = `${env.clientUrl}/reset-password?token=${rawToken}`;
  await sendPasswordResetEmail({ to: user.email, resetUrl });
}

export async function resetPassword({ token, newPassword }) {
  const tokenHash = hashToken(token);
  const resetToken = await PasswordResetToken.findOne({ tokenHash });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt.getTime() < Date.now()) {
    throw ApiError.badRequest("This password reset link is invalid or has expired");
  }

  const user = await User.findById(resetToken.user);
  if (!user) {
    throw ApiError.badRequest("This password reset link is invalid or has expired");
  }

  await user.setPassword(newPassword);
  if (!user.authProviders.includes("local")) user.authProviders.push("local");
  await user.save();

  resetToken.usedAt = new Date();
  await resetToken.save();
}
