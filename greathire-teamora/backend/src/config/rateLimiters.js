import rateLimit from "express-rate-limit";

// Shared response shape matches the rest of the API's error format.
function limitHandler(req, res) {
  res.status(429).json({
    success: false,
    error: "Too many requests. Please try again later.",
  });
}

// Login/register: generous enough for real users retrying a typo, tight
// enough to blunt credential-stuffing and account-enumeration attempts.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});

// Forgot-password: stricter, since each hit can trigger an outbound email.
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limitHandler,
});
