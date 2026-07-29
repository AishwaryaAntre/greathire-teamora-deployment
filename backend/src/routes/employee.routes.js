import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import * as employeeController from "../controllers/employee.controller.js";
import {
  listEmployeesSchema,
  employeeIdParamSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
} from "../validators/employee.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listEmployeesSchema), employeeController.listEmployees);
router.get("/quick-stats", employeeController.getQuickStats);
router.get("/departments", employeeController.listDepartments);
router.get("/:id", validate(employeeIdParamSchema), employeeController.getEmployee);

router.post(
  "/",
  requireRole("admin", "manager"),
  validate(createEmployeeSchema),
  employeeController.createEmployee
);
router.put(
  "/:id",
  requireRole("admin", "manager"),
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);
router.patch(
  "/:id/status",
  requireRole("admin", "manager"),
  validate(updateEmployeeStatusSchema),
  employeeController.updateEmployeeStatus
);
router.delete("/:id", requireRole("admin"), validate(employeeIdParamSchema), employeeController.deleteEmployee);

export default router;
