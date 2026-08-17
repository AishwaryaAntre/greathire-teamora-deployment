import { Router } from "express";
import { projectController } from "../controllers/projectController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import {
  projectListQuerySchema,
  projectCreateSchema,
  projectUpdateSchema,
  projectStatusUpdateSchema,
} from "../validators/projectValidators.js";

let router = Router();

router.use(requireAuth);

router.get("/", validate(projectListQuerySchema, "query"), asyncHandler(projectController.list));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(projectController.getById));

router.post("/", requireRole("admin"), validate(projectCreateSchema), asyncHandler(projectController.create));

router.patch(
  "/:id",
  requireRole("admin"),
  validate(idParamSchema, "params"),
  validate(projectUpdateSchema),
  asyncHandler(projectController.update)
);

// Status-only update: admin OR the project's assigned project manager.
// Permission is checked inside the controller (needs per-project PM data
// that route-level requireRole can't see), not here.
router.patch(
  "/:id/status",
  validate(idParamSchema, "params"),
  validate(projectStatusUpdateSchema),
  asyncHandler(projectController.updateStatus)
);

router.delete("/:id", requireRole("admin"), validate(idParamSchema, "params"), asyncHandler(projectController.remove));

export default router;
