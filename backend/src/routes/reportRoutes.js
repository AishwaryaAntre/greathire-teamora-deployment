import { Router } from "express";
import { reportController } from "../controllers/reportController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/stats", asyncHandler(reportController.getStats));
router.get("/attendance-trends", asyncHandler(reportController.getAttendanceTrends));
router.get("/working-hours", asyncHandler(reportController.getWorkingHours));
router.get("/departments", asyncHandler(reportController.listDepartments));
router.get("/", asyncHandler(reportController.listGenerated));
router.post("/generate", asyncHandler(reportController.generate));

export default router;
