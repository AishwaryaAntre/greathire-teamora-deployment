import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import * as notificationController from "../controllers/notification.controller.js";
import {
  listNotificationsSchema,
  notificationIdParamSchema,
  createNotificationSchema,
  updateNotificationPreferenceSchema,
} from "../validators/notification.validator.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listNotificationsSchema), notificationController.listNotifications);
router.get("/summary", notificationController.getSummary);
router.get("/preferences", notificationController.getPreferences);
router.put(
  "/preferences",
  validate(updateNotificationPreferenceSchema),
  notificationController.updatePreferences
);

router.post(
  "/",
  requireRole("admin", "manager"),
  validate(createNotificationSchema),
  notificationController.createNotification
);
router.patch(
  "/:id/read",
  validate(notificationIdParamSchema),
  notificationController.markAsRead
);
router.post("/mark-all-read", notificationController.markAllAsRead);

export default router;
