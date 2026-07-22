import express from "express";
import cors from "cors";
import morgan from "morgan";

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

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "*",
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(passport.initialize());

  // Non-blocking: populates req.user when a valid Bearer token is sent, but
  // every route below still works without one (see middleware/auth.js).
  app.use(attachUser);

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "GreatHire Teamora API is running" });
  });

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
