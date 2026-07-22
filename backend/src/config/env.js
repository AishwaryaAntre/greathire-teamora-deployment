import "dotenv/config";

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    // Fail fast in production; allow empty in dev so the server can still boot
    // for modules (like OAuth) that may not be configured yet.
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/greathire_worktrack"),

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", "dev_access_secret_change_me"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshSecret: required("JWT_REFRESH_SECRET", "dev_refresh_secret_change_me"),
    refreshExpiresInDefault: process.env.JWT_REFRESH_EXPIRES_IN_DEFAULT || "1d",
    refreshExpiresInRemember: process.env.JWT_REFRESH_EXPIRES_IN_REMEMBER || "30d",
  },

  cookie: {
    domain: process.env.COOKIE_DOMAIN || "localhost",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || "",
  },

  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID || "",
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
    callbackUrl: process.env.MICROSOFT_CALLBACK_URL || "",
  },

  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "GreatHire WorkTrack <no-reply@greathire.com>",
  },

  passwordReset: {
    expiresMin: Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MIN) || 30,
  },
};
