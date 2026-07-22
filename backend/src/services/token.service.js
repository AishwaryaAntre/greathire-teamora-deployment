import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import ms from "../utils/ms.js";
import { env } from "../config/env.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { ApiError } from "../utils/ApiError.js";

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

/**
 * Issues a new opaque refresh token, persists its hash, and returns
 * the raw token (only the raw value is ever sent to the client).
 */
export async function issueRefreshToken({ user, rememberMe, userAgent, ip }) {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashToken(rawToken);
  const ttl = rememberMe ? env.jwt.refreshExpiresInRemember : env.jwt.refreshExpiresInDefault;
  const expiresAt = new Date(Date.now() + ms(ttl));

  await RefreshToken.create({
    user: user._id,
    tokenHash,
    rememberMe,
    expiresAt,
    userAgent,
    ip,
  });

  return { rawToken, expiresAt };
}

/**
 * Validates a presented refresh token, rotates it (issues a replacement,
 * revokes the old one), and detects reuse of an already-revoked token
 * (a strong signal of token theft) by revoking the whole chain.
 */
export async function rotateRefreshToken({ rawToken, userAgent, ip }) {
  if (!rawToken) throw ApiError.unauthorized("Refresh token missing");

  const tokenHash = hashToken(rawToken);
  const existing = await RefreshToken.findOne({ tokenHash });

  if (!existing) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  if (existing.revokedAt) {
    // Reuse of a revoked token: revoke every active token for this user.
    await RefreshToken.updateMany(
      { user: existing.user, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    throw ApiError.unauthorized("Refresh token reuse detected. Please log in again.");
  }

  if (existing.expiresAt.getTime() < Date.now()) {
    throw ApiError.unauthorized("Refresh token expired");
  }

  const rawReplacement = crypto.randomBytes(48).toString("hex");
  const replacementHash = hashToken(rawReplacement);
  const ttl = existing.rememberMe ? env.jwt.refreshExpiresInRemember : env.jwt.refreshExpiresInDefault;

  await RefreshToken.create({
    user: existing.user,
    tokenHash: replacementHash,
    rememberMe: existing.rememberMe,
    expiresAt: new Date(Date.now() + ms(ttl)),
    userAgent,
    ip,
  });

  existing.revokedAt = new Date();
  existing.replacedByTokenHash = replacementHash;
  await existing.save();

  return { rawToken: rawReplacement, userId: existing.user, rememberMe: existing.rememberMe };
}

export async function revokeRefreshToken(rawToken) {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  await RefreshToken.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

export async function revokeAllUserTokens(userId) {
  await RefreshToken.updateMany(
    { user: userId, revokedAt: null },
    { $set: { revokedAt: new Date() } }
  );
}

export { hashToken };
