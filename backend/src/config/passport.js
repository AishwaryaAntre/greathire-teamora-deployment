import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";

/**
 * OAuth is opt-in: strategies only register if their client id/secret are
 * present in the environment, so `npm run dev` keeps working out of the box
 * with zero config (matching the rest of this backend). Set the env vars in
 * .env to enable "Continue with Google/Microsoft" on the login page.
 */
export let googleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export let microsoftEnabled = !!(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/oauth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        let email = profile.emails?.[0]?.value;
        done(null, { email, name: profile.displayName });
      }
    )
  );
}

if (microsoftEnabled) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || "/api/auth/oauth/microsoft/callback",
        scope: ["user.read"],
      },
      (accessToken, refreshToken, profile, done) => {
        let email = profile.emails?.[0]?.value || profile._json?.userPrincipalName;
        done(null, { email, name: profile.displayName });
      }
    )
  );
}

export default passport;
