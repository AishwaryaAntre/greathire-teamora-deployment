import { Router } from "express";
import { messageController } from "../controllers/messageController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/common.js";
import { messageListQuerySchema, sendMessageSchema } from "../validators/messageValidators.js";

let router = Router();

router.use(requireAuth);

router.get("/conversations", asyncHandler(messageController.listConversations));
router.get("/conversations/:id", validate(idParamSchema, "params"), asyncHandler(messageController.getConversation));
router.get(
  "/conversations/:id/messages",
  validate(idParamSchema, "params"),
  validate(messageListQuerySchema, "query"),
  asyncHandler(messageController.listMessages)
);
router.post(
  "/conversations/:id/messages",
  validate(idParamSchema, "params"),
  validate(sendMessageSchema),
  asyncHandler(messageController.sendMessage)
);
router.post("/conversations/:id/read", validate(idParamSchema, "params"), asyncHandler(messageController.markRead));

export default router;
