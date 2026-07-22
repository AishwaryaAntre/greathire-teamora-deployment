import { Router } from "express";
import { employeeDashboardController } from "../controllers/employeeDashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

let router = Router();

// Self-service (no id) — defaults to CURRENT_EMPLOYEE_ID.
router.get("/current-user", asyncHandler(employeeDashboardController.getCurrentUser));
router.get("/status", asyncHandler(employeeDashboardController.getCurrentStatus));
router.get("/quick-actions", asyncHandler(employeeDashboardController.getQuickActions));
router.get("/hours-stats", asyncHandler(employeeDashboardController.getHoursStats));
router.get("/attendance-legend", asyncHandler(employeeDashboardController.getAttendanceLegend));
router.get("/attendance-month", asyncHandler(employeeDashboardController.getAttendanceMonth));
router.get("/timeline", asyncHandler(employeeDashboardController.getTimeline));
router.get("/leave-balances", asyncHandler(employeeDashboardController.getLeaveBalances));
router.get("/upcoming-holidays", asyncHandler(employeeDashboardController.getUpcomingHolidays));
router.get("/quick-links", asyncHandler(employeeDashboardController.getQuickLinks));
router.get("/attendance-summary", asyncHandler(employeeDashboardController.getAttendanceSummary));
router.get("/announcement", asyncHandler(employeeDashboardController.getAnnouncement));
router.get("/dashboard", asyncHandler(employeeDashboardController.getBundle));

// Viewing a specific employee's dashboard by id.
router.get("/:id/current-user", asyncHandler(employeeDashboardController.getCurrentUser));
router.get("/:id/status", asyncHandler(employeeDashboardController.getCurrentStatus));
router.get("/:id/hours-stats", asyncHandler(employeeDashboardController.getHoursStats));
router.get("/:id/attendance-month", asyncHandler(employeeDashboardController.getAttendanceMonth));
router.get("/:id/timeline", asyncHandler(employeeDashboardController.getTimeline));
router.get("/:id/leave-balances", asyncHandler(employeeDashboardController.getLeaveBalances));
router.get("/:id/attendance-summary", asyncHandler(employeeDashboardController.getAttendanceSummary));
router.get("/:id/dashboard", asyncHandler(employeeDashboardController.getBundle));

export default router;
