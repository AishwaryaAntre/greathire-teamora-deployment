import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { dashboardLimitQuerySchema } from "../validators/miscValidators.js";

let router = Router();

// Admin dashboard — company-wide data, admin-only.
router.use(requireAuth, requireRole("admin"));

router.get("/overview", asyncHandler(dashboardController.getOverview));
router.get("/snapshot", asyncHandler(dashboardController.getSnapshot));
router.get("/metrics", asyncHandler(dashboardController.getMetrics));
router.get("/live-workforce", validate(dashboardLimitQuerySchema, "query"), asyncHandler(dashboardController.getLiveWorkforce));
router.get("/activity", validate(dashboardLimitQuerySchema, "query"), asyncHandler(dashboardController.getRecentActivity));
router.get("/", asyncHandler(dashboardController.getAll));

export default router;
