import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import { env } from "./env.js";
import { findOrCreateOAuthUser } from "../services/auth.service.js";

// Stateless API: we don't use Passport sessions, only the OAuth handshake.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

if (env.google.clientId && env.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.google.clientId,
        clientSecret: env.google.clientSecret,
        callbackURL: env.google.callbackUrl,
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("Google account has no email"));

          const user = await findOrCreateOAuthUser({
            provider: "google",
            providerId: profile.id,
            email,
            name: profile.displayName || email.split("@")[0],
            avatarUrl: profile.photos?.[0]?.value || null,
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
} else {
  console.warn("[passport] Google OAuth not configured - GOOGLE_CLIENT_ID/SECRET missing.");
}

if (env.microsoft.clientId && env.microsoft.clientSecret) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: env.microsoft.clientId,
        clientSecret: env.microsoft.clientSecret,
        callbackURL: env.microsoft.callbackUrl,
        scope: ["user.read"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || profile._json?.mail || profile._json?.userPrincipalName;
          if (!email) return done(new Error("Microsoft account has no email"));

          const user = await findOrCreateOAuthUser({
            provider: "microsoft",
            providerId: profile.id,
            email,
            name: profile.displayName || email.split("@")[0],
            avatarUrl: null,
          });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
} else {
  console.warn("[passport] Microsoft OAuth not configured - MICROSOFT_CLIENT_ID/SECRET missing.");
}

export default passport;
