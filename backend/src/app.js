import express from "express";
import cors from "cors";
import morgan from "morgan";

import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
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

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "GreatHire Teamora API is running" });
  });

  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/leave", leaveRoutes);
  app.use("/api/reports", reportRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
