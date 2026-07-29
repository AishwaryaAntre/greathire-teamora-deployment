import { Router } from "express";
import rateLimit from "express-rate-limit";
import passport from "../config/passport.js";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  registerSchema,
} from "../validators/auth.validator.js";
import * as authController from "../controllers/auth.controller.js";
import { oauthCallback } from "../controllers/oauth.controller.js";

const router = Router();

// Tighter limiter on credential-guessing-prone endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.getMe);

router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// --- OAuth ---
router.get("/oauth/google", passport.authenticate("google", { session: false }));
router.get(
  "/oauth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/oauth/failure" }),
  oauthCallback
);

router.get("/oauth/microsoft", passport.authenticate("microsoft", { session: false }));
router.get(
  "/oauth/microsoft/callback",
  passport.authenticate("microsoft", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  oauthCallback
);

router.get("/oauth/failure", (req, res) => {
  res.redirect(`${process.env.CLIENT_URL || "/"}/login?error=oauth_failed`);
});

export default router;
