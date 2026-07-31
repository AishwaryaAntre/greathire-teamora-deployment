import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
const DEFAULT_EXPIRY = process.env.JWT_EXPIRES_IN || "1d";
const REMEMBER_ME_EXPIRY = process.env.JWT_REMEMBER_ME_EXPIRES_IN || "30d";

export function signAccessToken(payload, { rememberMe = false } = {}) {
  return jwt.sign(payload, SECRET, {
    expiresIn: rememberMe ? REMEMBER_ME_EXPIRY : DEFAULT_EXPIRY,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
