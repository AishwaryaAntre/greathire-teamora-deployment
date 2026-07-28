import { Router } from "express";
import { dashboardController } from "../controllers/dashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

let router = Router();

router.get("/overview", asyncHandler(dashboardController.getOverview));
router.get("/snapshot", asyncHandler(dashboardController.getSnapshot));
router.get("/metrics", asyncHandler(dashboardController.getMetrics));
router.get("/live-workforce", asyncHandler(dashboardController.getLiveWorkforce));
router.get("/activity", asyncHandler(dashboardController.getRecentActivity));
router.get("/", asyncHandler(dashboardController.getAll));

export default router;
