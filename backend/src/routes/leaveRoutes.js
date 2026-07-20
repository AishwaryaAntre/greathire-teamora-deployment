import { Router } from "express";
import { leaveController } from "../controllers/leaveController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/stats", asyncHandler(leaveController.getStats));
router.get("/team-availability", asyncHandler(leaveController.getTeamAvailability));
router.get("/types", asyncHandler(leaveController.getLeaveTypes));
router.get("/export", asyncHandler(leaveController.exportCsv));

router.get("/requests", asyncHandler(leaveController.list));
router.get("/requests/:id", asyncHandler(leaveController.getById));
router.post("/requests", asyncHandler(leaveController.create));
router.post("/requests/approve-all", asyncHandler(leaveController.approveAll));
router.patch("/requests/:id/approve", asyncHandler(leaveController.approve));
router.patch("/requests/:id/reject", asyncHandler(leaveController.reject));

export default router;
