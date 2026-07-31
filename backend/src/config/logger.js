import pino from "pino";

// Structured JSON logs. Point LOG_LEVEL at "debug"/"warn"/etc. to change verbosity
// without a code change; defaults to "info" in production and "debug" locally.
export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  base: { service: "greathire-teamora-backend" },
  timestamp: pino.stdTimeFunctions.isoTime,
});
