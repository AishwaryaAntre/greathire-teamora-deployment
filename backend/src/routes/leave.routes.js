import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import * as leaveController from "../controllers/leave.controller.js";
import {
  listLeaveSchema,
  leaveIdParamSchema,
  createLeaveSchema,
  decideLeaveSchema,
} from "../validators/leave.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listLeaveSchema), leaveController.listLeaveRequests);
router.get("/stats", leaveController.getStatsCards);
router.get("/team-availability", leaveController.getTeamAvailability);
router.get("/:id", validate(leaveIdParamSchema), leaveController.getLeaveRequest);

router.post("/", validate(createLeaveSchema), leaveController.createLeaveRequest);
router.patch(
  "/:id/decision",
  requireRole("admin", "manager"),
  validate(decideLeaveSchema),
  leaveController.decideLeaveRequest
);
router.post(
  "/approve-all-pending",
  requireRole("admin", "manager"),
  leaveController.approveAllPending
);

export default router;
