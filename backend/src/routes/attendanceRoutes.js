import { Router } from "express";
import { attendanceController } from "../controllers/attendanceController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

let router = Router();

router.get("/stats", asyncHandler(attendanceController.getStats));
router.get("/live", asyncHandler(attendanceController.getLive));
router.get("/summary", asyncHandler(attendanceController.getSummary));
router.get("/departments", asyncHandler(attendanceController.listDepartments));
router.get("/export", asyncHandler(attendanceController.exportCsv));
router.get("/", asyncHandler(attendanceController.list));

router.post("/check-in", asyncHandler(attendanceController.checkIn));
router.post("/check-out", asyncHandler(attendanceController.checkOut));
router.patch("/:id", asyncHandler(attendanceController.update));

export default router;
