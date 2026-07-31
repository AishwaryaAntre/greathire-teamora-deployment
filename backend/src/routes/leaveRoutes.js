import { Router } from "express";
import { leaveController } from "../controllers/leaveController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import { leaveListQuerySchema, leaveFilterQuerySchema, leaveCreateSchema } from "../validators/leaveValidators.js";

let router = Router();

router.use(requireAuth);

router.get("/stats", asyncHandler(leaveController.getStats));
router.get("/team-availability", asyncHandler(leaveController.getTeamAvailability));
router.get("/types", asyncHandler(leaveController.getLeaveTypes));
router.get(
  "/export",
  requireRole("admin"),
  validate(leaveFilterQuerySchema, "query"),
  asyncHandler(leaveController.exportCsv)
);

router.get("/requests", validate(leaveListQuerySchema, "query"), asyncHandler(leaveController.list));
router.get("/requests/:id", validate(idParamSchema, "params"), asyncHandler(leaveController.getById));
router.post("/requests", validate(leaveCreateSchema), asyncHandler(leaveController.create));
router.post("/requests/approve-all", requireRole("admin"), asyncHandler(leaveController.approveAll));
router.patch(
  "/requests/:id/approve",
  requireRole("admin"),
  validate(idParamSchema, "params"),
  asyncHandler(leaveController.approve)
);
router.patch(
  "/requests/:id/reject",
  requireRole("admin"),
  validate(idParamSchema, "params"),
  asyncHandler(leaveController.reject)
);

export default router;
