import { RefreshTokenModel } from "../db/schemas.js";
import { generateId } from "../utils/id.js";
import { generateRawToken, hashToken, parseDurationMs } from "../utils/refreshToken.js";

const DEFAULT_TTL_MS = parseDurationMs(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 86_400_000); // 7 days
const REMEMBER_ME_TTL_MS = parseDurationMs(process.env.JWT_REFRESH_REMEMBER_ME_EXPIRES_IN, 30 * 86_400_000); // 30 days

export const RefreshTokenStore = {
  /** Issues a brand-new refresh token for a user (e.g. at login/register) and
   * returns the raw value — only this call site should ever see it. */
  async issue(userId, { rememberMe = false } = {}) {
    let rawToken = generateRawToken();
    let ttlMs = rememberMe ? REMEMBER_ME_TTL_MS : DEFAULT_TTL_MS;
    await RefreshTokenModel.create({
      id: generateId("rtok"),
      userId,
      tokenHash: hashToken(rawToken),
      rememberMe,
      expiresAt: new Date(Date.now() + ttlMs),
    });
    return rawToken;
  },

  /**
   * Validates a presented refresh token and rotates it: the old token is
   * revoked and a fresh one issued in its place. Reuse of an already-revoked
   * token (a strong signal of theft, e.g. a stolen token used after the
   * legitimate client already rotated it) revokes every active token for
   * that user, forcing a fresh login everywhere.
   *
   * Returns { userId, rawToken } on success, or null if the token is invalid,
   * expired, or reuse was detected (all three should look identical to the
   * caller — just "please log in again").
   */
  async rotate(presentedRawToken) {
    if (!presentedRawToken) return null;
    let tokenHash = hashToken(presentedRawToken);
    let existing = await RefreshTokenModel.findOne({ tokenHash });
    if (!existing) return null;

    if (existing.revokedAt) {
      await RefreshTokenModel.updateMany(
        { userId: existing.userId, revokedAt: null },
        { $set: { revokedAt: new Date() } }
      );
      return null;
    }

    if (existing.expiresAt.getTime() < Date.now()) return null;

    let rawReplacement = generateRawToken();
    let replacementHash = hashToken(rawReplacement);
    let ttlMs = existing.rememberMe ? REMEMBER_ME_TTL_MS : DEFAULT_TTL_MS;

    await RefreshTokenModel.create({
      id: generateId("rtok"),
      userId: existing.userId,
      tokenHash: replacementHash,
      rememberMe: existing.rememberMe,
      expiresAt: new Date(Date.now() + ttlMs),
    });

    existing.revokedAt = new Date();
    existing.replacedByTokenHash = replacementHash;
    await existing.save();

    return { userId: existing.userId, rawToken: rawReplacement };
  },

  /** Revokes a single refresh token (e.g. on logout from one device). */
  async revoke(presentedRawToken) {
    if (!presentedRawToken) return;
    await RefreshTokenModel.updateOne(
      { tokenHash: hashToken(presentedRawToken), revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
  },

  /** Revokes every active refresh token for a user (e.g. "log out everywhere",
   * or as part of reuse-detection above). */
  async revokeAllForUser(userId) {
    await RefreshTokenModel.updateMany({ userId, revokedAt: null }, { $set: { revokedAt: new Date() } });
  },
};
