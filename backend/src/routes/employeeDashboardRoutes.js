import { Router } from "express";
import { employeeDashboardController } from "../controllers/employeeDashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { ApiError } from "../middleware/errorHandler.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import { attendanceMonthQuerySchema, upcomingHolidaysQuerySchema } from "../validators/miscValidators.js";

let router = Router();

router.use(requireAuth);

// Personal dashboard data (hours, leave balances, timeline, etc.) is only visible
// to the employee themself or an admin — unlike the read-only directory profile.
function requireSelfOrAdmin(req, res, next) {
  if (req.user.role === "admin" || req.user.employeeId === req.params.id) return next();
  throw new ApiError(403, "You can only view your own dashboard data");
}

// Self-service (no id) — defaults to CURRENT_EMPLOYEE_ID.
router.get("/current-user", asyncHandler(employeeDashboardController.getCurrentUser));
router.get("/status", asyncHandler(employeeDashboardController.getCurrentStatus));
router.get("/quick-actions", asyncHandler(employeeDashboardController.getQuickActions));
router.get("/hours-stats", asyncHandler(employeeDashboardController.getHoursStats));
router.get("/attendance-legend", asyncHandler(employeeDashboardController.getAttendanceLegend));
router.get(
  "/attendance-month",
  validate(attendanceMonthQuerySchema, "query"),
  asyncHandler(employeeDashboardController.getAttendanceMonth)
);
router.get("/timeline", asyncHandler(employeeDashboardController.getTimeline));
router.get("/leave-balances", asyncHandler(employeeDashboardController.getLeaveBalances));
router.get(
  "/upcoming-holidays",
  validate(upcomingHolidaysQuerySchema, "query"),
  asyncHandler(employeeDashboardController.getUpcomingHolidays)
);
router.get("/quick-links", asyncHandler(employeeDashboardController.getQuickLinks));
router.get("/attendance-summary", asyncHandler(employeeDashboardController.getAttendanceSummary));
router.get("/announcement", asyncHandler(employeeDashboardController.getAnnouncement));
router.get("/dashboard", asyncHandler(employeeDashboardController.getBundle));

// Viewing a specific employee's dashboard by id — self or admin only.
router.use("/:id", validate(idParamSchema, "params"), requireSelfOrAdmin);
router.get("/:id/current-user", asyncHandler(employeeDashboardController.getCurrentUser));
router.get("/:id/status", asyncHandler(employeeDashboardController.getCurrentStatus));
router.get("/:id/hours-stats", asyncHandler(employeeDashboardController.getHoursStats));
router.get(
  "/:id/attendance-month",
  validate(attendanceMonthQuerySchema, "query"),
  asyncHandler(employeeDashboardController.getAttendanceMonth)
);
router.get("/:id/timeline", asyncHandler(employeeDashboardController.getTimeline));
router.get("/:id/leave-balances", asyncHandler(employeeDashboardController.getLeaveBalances));
router.get("/:id/attendance-summary", asyncHandler(employeeDashboardController.getAttendanceSummary));
router.get("/:id/dashboard", asyncHandler(employeeDashboardController.getBundle));

export default router;
