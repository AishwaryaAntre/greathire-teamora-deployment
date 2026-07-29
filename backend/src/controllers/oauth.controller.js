import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";
import { signAccessToken, issueRefreshToken } from "../services/token.service.js";

const REFRESH_COOKIE_NAME = "refreshToken";

/**
 * Called after passport.authenticate(...) has already populated req.user
 * (set by the Google/Microsoft strategy's `done(null, user)` callback).
 *
 * Since this is a redirect-based browser flow (not fetch/XHR), we can't
 * return JSON. Instead we set the refresh token cookie and redirect to
 * the frontend with a short-lived access token in the URL fragment,
 * which the frontend reads once and discards (fragments aren't sent to
 * the server or logged, unlike query strings).
 */
export const oauthCallback = asyncHandler(async (req, res) => {
  const user = req.user;
  const accessToken = signAccessToken(user);
  const { rawToken, expiresAt } = await issueRefreshToken({
    user,
    rememberMe: true, // OAuth sign-ins default to persistent sessions
    userAgent: req.headers["user-agent"] || null,
    ip: req.ip,
  });

  res.cookie(REFRESH_COOKIE_NAME, rawToken, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/api/auth",
  });

  res.redirect(`${env.clientUrl}/oauth/callback#accessToken=${accessToken}`);
});
