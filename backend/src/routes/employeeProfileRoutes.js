import { Router } from "express";
import { employeeProfileController } from "../controllers/employeeProfileController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

let router = Router();

// GET /api/employees — directory list of every employee.
router.get("/", asyncHandler(employeeProfileController.listAll));

// Self-service (no id) — defaults to CURRENT_EMPLOYEE_ID.
router.get("/profile", asyncHandler(employeeProfileController.getProfile));
router.get("/profile/stat-cards", asyncHandler(employeeProfileController.getStatCards));
router.get("/profile/work-summary", asyncHandler(employeeProfileController.getWorkSummary));
router.get("/profile/activity-map", asyncHandler(employeeProfileController.getActivityMap));
router.get("/profile/personal-info", asyncHandler(employeeProfileController.getPersonalInfo));
router.put("/profile/personal-info", asyncHandler(employeeProfileController.updatePersonalInfo));
router.get("/profile/documents", asyncHandler(employeeProfileController.getDocuments));
router.get("/profile/bundle", asyncHandler(employeeProfileController.getBundle));

// Viewing a specific employee's profile by id (e.g. from a directory list).
router.get("/:id/profile", asyncHandler(employeeProfileController.getProfile));
router.get("/:id/profile/stat-cards", asyncHandler(employeeProfileController.getStatCards));
router.get("/:id/profile/work-summary", asyncHandler(employeeProfileController.getWorkSummary));
router.get("/:id/profile/activity-map", asyncHandler(employeeProfileController.getActivityMap));
router.get("/:id/profile/personal-info", asyncHandler(employeeProfileController.getPersonalInfo));
router.put("/:id/profile/personal-info", asyncHandler(employeeProfileController.updatePersonalInfo));
router.get("/:id/profile/documents", asyncHandler(employeeProfileController.getDocuments));
router.get("/:id/profile/bundle", asyncHandler(employeeProfileController.getBundle));

export default router;
