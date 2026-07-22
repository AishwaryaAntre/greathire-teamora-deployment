import jwt from "jsonwebtoken";

let SECRET = process.env.JWT_SECRET || "dev-only-insecure-secret-change-me";
let DEFAULT_EXPIRY = process.env.JWT_EXPIRES_IN || "1d";
let REMEMBER_ME_EXPIRY = process.env.JWT_REMEMBER_ME_EXPIRES_IN || "30d";

export function signAccessToken(payload, { rememberMe = false } = {}) {
  return jwt.sign(payload, SECRET, {
    expiresIn: rememberMe ? REMEMBER_ME_EXPIRY : DEFAULT_EXPIRY,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
