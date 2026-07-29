import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/overview", dashboardController.getOverview);
router.get("/snapshot", dashboardController.getSnapshot);
router.get("/metrics", dashboardController.getMetrics);
router.get("/live-workforce", dashboardController.getLiveWorkforce);
router.get("/recent-activity", dashboardController.getRecentActivity);

export default router;
