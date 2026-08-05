import { Router } from "express";
import { employeeProfileController } from "../controllers/employeeProfileController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import { createEmployeeSchema, updatePersonalInfoSchema } from "../validators/employeeValidators.js";

let router = Router();

router.use(requireAuth);

// GET /api/employees — directory list of every employee. Read-only for everyone.
router.get("/", asyncHandler(employeeProfileController.listAll));

// POST /api/employees — admin-only: add a new employee or admin account.
router.post("/", requireRole("admin"), validate(createEmployeeSchema), asyncHandler(employeeProfileController.createEmployee));

// DELETE /api/employees/:id — admin-only: permanently remove an employee
// (their login account and attendance/leave history go with them).
router.delete(
  "/:id",
  requireRole("admin"),
  validate(idParamSchema, "params"),
  asyncHandler(employeeProfileController.deleteEmployee)
);

// Self-service (no id) — defaults to CURRENT_EMPLOYEE_ID.
router.get("/profile", asyncHandler(employeeProfileController.getProfile));
router.get("/profile/stat-cards", asyncHandler(employeeProfileController.getStatCards));
router.get("/profile/work-summary", asyncHandler(employeeProfileController.getWorkSummary));
router.get("/profile/activity-map", asyncHandler(employeeProfileController.getActivityMap));
router.get("/profile/personal-info", asyncHandler(employeeProfileController.getPersonalInfo));
router.put(
  "/profile/personal-info",
  validate(updatePersonalInfoSchema),
  asyncHandler(employeeProfileController.updatePersonalInfo)
);
router.get("/profile/documents", asyncHandler(employeeProfileController.getDocuments));
router.get("/profile/bundle", asyncHandler(employeeProfileController.getBundle));

// Viewing a specific employee's profile by id (e.g. from a directory list).
// Read-only for everyone; editing another employee's info is admin-only (enforced in the controller).
router.get("/:id/profile", validate(idParamSchema, "params"), asyncHandler(employeeProfileController.getProfile));
router.get(
  "/:id/profile/stat-cards",
  validate(idParamSchema, "params"),
  asyncHandler(employeeProfileController.getStatCards)
);
router.get(
  "/:id/profile/work-summary",
  validate(idParamSchema, "params"),
  asyncHandler(employeeProfileController.getWorkSummary)
);
router.get(
  "/:id/profile/activity-map",
  validate(idParamSchema, "params"),
  asyncHandler(employeeProfileController.getActivityMap)
);
router.get(
  "/:id/profile/personal-info",
  validate(idParamSchema, "params"),
  asyncHandler(employeeProfileController.getPersonalInfo)
);
router.put(
  "/:id/profile/personal-info",
  validate(idParamSchema, "params"),
  validate(updatePersonalInfoSchema),
  asyncHandler(employeeProfileController.updatePersonalInfo)
);
router.get(
  "/:id/profile/documents",
  validate(idParamSchema, "params"),
  asyncHandler(employeeProfileController.getDocuments)
);
router.get("/:id/profile/bundle", validate(idParamSchema, "params"), asyncHandler(employeeProfileController.getBundle));

export default router;
