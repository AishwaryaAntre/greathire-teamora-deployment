// Fails fast at boot if required environment variables are missing, instead
// of letting the app start and surface confusing errors (or silently run
// with insecure defaults) later on.
import { logger } from "./logger.js";

const REQUIRED_VARS = ["JWT_SECRET", "MONGODB_URI"];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name] || process.env[name].trim() === "");

  if (missing.length > 0) {
    logger.error(
      { missing },
      `[boot] Missing required environment variable(s): ${missing.join(", ")}. ` +
        `Copy .env.example to .env and fill these in before starting the server.`
    );
    process.exit(1);
  }
}
