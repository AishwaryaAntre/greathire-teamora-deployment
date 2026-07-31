import { Router } from "express";
import { attendanceController } from "../controllers/attendanceController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import {
  attendanceListQuerySchema,
  attendanceDateFilterQuerySchema,
  attendanceUpdateSchema,
} from "../validators/attendanceValidators.js";

let router = Router();

router.use(requireAuth);

router.get("/stats", validate(attendanceDateFilterQuerySchema, "query"), asyncHandler(attendanceController.getStats));
router.get("/live", validate(attendanceDateFilterQuerySchema, "query"), asyncHandler(attendanceController.getLive));
router.get("/summary", validate(attendanceDateFilterQuerySchema, "query"), asyncHandler(attendanceController.getSummary));
router.get("/departments", asyncHandler(attendanceController.listDepartments));
router.get(
  "/export",
  requireRole("admin"),
  validate(attendanceDateFilterQuerySchema, "query"),
  asyncHandler(attendanceController.exportCsv)
);
router.get("/", validate(attendanceListQuerySchema, "query"), asyncHandler(attendanceController.list));

router.post("/check-in", asyncHandler(attendanceController.checkIn));
router.post("/check-out", asyncHandler(attendanceController.checkOut));
router.post("/start-break", asyncHandler(attendanceController.startBreak));
router.post("/resume-work", asyncHandler(attendanceController.resumeWork));
router.patch(
  "/:id",
  requireRole("admin"),
  validate(idParamSchema, "params"),
  validate(attendanceUpdateSchema),
  asyncHandler(attendanceController.update)
);

export default router;
