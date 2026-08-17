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
import projectRoutes from "./routes/projectRoutes.js";
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

  // Allow the API to be accessed from a specific deployed frontend domain
  // instead of crossing a local-only development assumption. CLIENT_ORIGIN can
  // contain a comma-separated list of exact origins for Vercel/Render combos.
  
  // const clientOrigins = (process.env.CLIENT_ORIGIN || process.env.CORS_ORIGIN || "")
  //   .split(",")
  //   .map((origin) => origin.trim())
  //   .filter(Boolean);
  // if (!clientOrigins.length) {
  
  let clientOrigin = process.env.CLIENT_ORIGIN;
  if (!clientOrigin) {
  if (process.env.NODE_ENV === "production") {
      throw new Error("CLIENT_ORIGIN must be set in production (no wildcard CORS allowed).");
    }
    //clientOrigins.push("http://localhost:5173");
      clientOrigin = "http://localhost:5173";
  }

  app.use(
    cors({
        origin: clientOrigin,
      // origin: (origin, callback) => {
      //   if (!origin) {
      //     callback(null, true);
      //     return;
      //   }

        // if (clientOrigins.includes(origin)) {
        //   callback(null, true);
        //   return;
        // }

      //   logger.warn({ origin, allowed: clientOrigins }, "[cors] denied origin");
      //   callback(new Error(`Origin ${origin} is not allowed by CORS`));
      // },

      
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
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
  app.use("/api/projects", projectRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
