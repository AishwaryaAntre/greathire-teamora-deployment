import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as reportController from "../controllers/report.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/stats", reportController.getStatsCards);
router.get("/attendance-trends", reportController.getAttendanceTrends);
router.get("/working-hours-trend", reportController.getWorkingHoursTrend);
router.get("/departments", reportController.listDepartments);

export default router;
