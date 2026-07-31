import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const openapiDocument = YAML.parse(readFileSync(join(__dirname, "..", "openapi.yaml"), "utf8"));

import { logger } from "./config/logger.js";
import passport from "./config/passport.js";
import { attachUser } from "./middleware/auth.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeDashboardRoutes from "./routes/employeeDashboardRoutes.js";
import employeeProfileRoutes from "./routes/employeeProfileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  let app = express();

  app.use(helmet());
  app.use(
    pinoHttp({
      logger,
      redact: ["req.headers.authorization", "req.headers.cookie"],
      customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    })
  );

  // Locked to a single, explicit origin — never falls back to "*". In
  // development this defaults to the Vite dev server; in any other
  // environment CLIENT_ORIGIN must be set (validateEnv covers the
  // hard-required vars; this one only matters once you deploy, so it's
  // enforced here instead).
  let clientOrigin = process.env.CLIENT_ORIGIN;
  if (!clientOrigin) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CLIENT_ORIGIN must be set in production (no wildcard CORS allowed).");
    }
    clientOrigin = "http://localhost:5173";
  }

  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(passport.initialize());

  // Non-blocking: populates req.user when a valid Bearer token is sent, but
  // every route below still works without one (see middleware/auth.js).
  app.use(attachUser);

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "GreatHire Teamora API is running" });
  });

  // Interactive API docs — http://localhost:5000/api-docs
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

  app.use("/api/auth", authRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/leave", leaveRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/employee", employeeDashboardRoutes);
  app.use("/api/employees", employeeProfileRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/messages", messageRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
