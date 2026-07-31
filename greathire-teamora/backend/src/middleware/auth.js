import { verifyToken } from "../utils/jwt.js";
import { UsersStore } from "../data/usersStore.js";
import { ApiError } from "./errorHandler.js";

function extractToken(req) {
  let header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/**
 * Populates req.user if a valid token is present, but never blocks the request.
 * Most routes stay accessible without a token; controllers can still personalize
 * a response when one IS sent.
 */
export async function attachUser(req, res, next) {
  let token = extractToken(req);
  if (!token) return next();
  try {
    let payload = verifyToken(token);
    let user = await UsersStore.findById(payload.sub);
    if (user) {
      req.user = { id: user.id, employeeId: user.employeeId, name: user.name, email: user.email, role: user.role };
    }
  } catch {
    // Invalid/expired token on a public route — just proceed unauthenticated.
  }
  next();
}

/** Use on routes that must be authenticated (e.g. /api/auth/me). */
export async function requireAuth(req, res, next) {
  let token = extractToken(req);
  if (!token) return next(new ApiError(401, "Authentication required"));
  try {
    let payload = verifyToken(token);
    let user = await UsersStore.findById(payload.sub);
    if (!user) return next(new ApiError(401, "Invalid session"));
    req.user = { id: user.id, employeeId: user.employeeId, name: user.name, email: user.email, role: user.role };
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    next(new ApiError(401, "Invalid or expired token"));
  }
}

/** Use after requireAuth to restrict to specific roles. */
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) throw new ApiError(401, "Authentication required");
    if (!roles.includes(req.user.role)) throw new ApiError(403, "Insufficient permissions");
    next();
  };
}
