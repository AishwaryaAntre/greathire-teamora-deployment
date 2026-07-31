import crypto from "node:crypto";

/** Generates a high-entropy opaque token. Only the raw value goes to the
 * client; only its hash is ever persisted. */
export function generateRawToken() {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/** Parses simple "15m" / "1d" / "30d" style durations into milliseconds.
 * Supports s(econds), m(inutes), h(ours), d(ays). */
export function parseDurationMs(input, fallbackMs) {
  let match = /^(\d+)\s*(s|m|h|d)$/i.exec(String(input || "").trim());
  if (!match) return fallbackMs;
  let value = Number(match[1]);
  let unitMs = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2].toLowerCase()];
  return value * unitMs;
}
