import { Router } from "express";
import { messageController } from "../controllers/messageController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

let router = Router();

router.get("/conversations", asyncHandler(messageController.listConversations));
router.get("/conversations/:id", asyncHandler(messageController.getConversation));
router.get("/conversations/:id/messages", asyncHandler(messageController.listMessages));
router.post("/conversations/:id/messages", asyncHandler(messageController.sendMessage));
router.post("/conversations/:id/read", asyncHandler(messageController.markRead));

export default router;
