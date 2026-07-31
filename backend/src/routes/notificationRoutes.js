import { Router } from "express";
import { notificationController } from "../controllers/notificationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import {
  notificationListQuerySchema,
  notificationPreferencesSchema,
  notificationCreateSchema,
} from "../validators/notificationValidators.js";

let router = Router();

router.use(requireAuth);

router.get("/", validate(notificationListQuerySchema, "query"), asyncHandler(notificationController.list));
router.get("/summary", asyncHandler(notificationController.getSummary));
router.get("/preferences", asyncHandler(notificationController.getPreferences));
router.put("/preferences", validate(notificationPreferencesSchema), asyncHandler(notificationController.updatePreferences));

router.post("/", requireRole("admin"), validate(notificationCreateSchema), asyncHandler(notificationController.create));
router.patch("/:id/read", validate(idParamSchema, "params"), asyncHandler(notificationController.markAsRead));
router.post("/mark-all-read", asyncHandler(notificationController.markAllAsRead));

export default router;
