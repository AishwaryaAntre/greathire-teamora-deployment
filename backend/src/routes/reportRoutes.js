import { Router } from "express";
import { reportController } from "../controllers/reportController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reportRangeQuerySchema, reportGenerateSchema } from "../validators/miscValidators.js";

let router = Router();

// Reports are company-wide analytics — admin-only.
router.use(requireAuth, requireRole("admin"));

router.get("/stats", validate(reportRangeQuerySchema, "query"), asyncHandler(reportController.getStats));
router.get(
  "/attendance-trends",
  validate(reportRangeQuerySchema, "query"),
  asyncHandler(reportController.getAttendanceTrends)
);
router.get("/working-hours", validate(reportRangeQuerySchema, "query"), asyncHandler(reportController.getWorkingHours));
router.get("/departments", asyncHandler(reportController.listDepartments));
router.get("/", asyncHandler(reportController.listGenerated));
router.post("/generate", validate(reportGenerateSchema), asyncHandler(reportController.generate));

export default router;
