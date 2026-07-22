import { Router } from "express";
import { notificationController } from "../controllers/notificationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

let router = Router();

router.get("/", asyncHandler(notificationController.list));
router.get("/summary", asyncHandler(notificationController.getSummary));
router.get("/preferences", asyncHandler(notificationController.getPreferences));
router.put("/preferences", asyncHandler(notificationController.updatePreferences));

router.post("/", asyncHandler(notificationController.create));
router.patch("/:id/read", asyncHandler(notificationController.markAsRead));
router.post("/mark-all-read", asyncHandler(notificationController.markAllAsRead));

export default router;
