import { Router } from "express";
import authRoutes from "./auth.routes.js";
import employeeRoutes from "./employee.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import leaveRoutes from "./leave.routes.js";
import notificationRoutes from "./notification.routes.js";
import reportRoutes from "./report.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.get("/health", (req, res) => res.status(200).json({ success: true, message: "ok" }));

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leave", leaveRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
