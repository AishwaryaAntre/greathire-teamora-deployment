import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import * as attendanceController from "../controllers/attendance.controller.js";
import {
  listAttendanceSchema,
  checkInOutSchema,
  updateAttendanceStatusSchema,
} from "../validators/attendance.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listAttendanceSchema), attendanceController.listAttendance);
router.get("/stats", attendanceController.getStatsCards);

router.post("/check-in", validate(checkInOutSchema), attendanceController.checkIn);
router.post("/check-out", validate(checkInOutSchema), attendanceController.checkOut);
router.post("/break/start", validate(checkInOutSchema), attendanceController.startBreak);
router.post("/break/end", validate(checkInOutSchema), attendanceController.endBreak);

router.patch(
  "/:id/status",
  requireRole("admin", "manager"),
  validate(updateAttendanceStatusSchema),
  attendanceController.updateAttendanceStatus
);

export default router;
