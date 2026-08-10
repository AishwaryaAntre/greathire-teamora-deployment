import { Message } from "../models/Message.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";
import { ApiError } from "../middleware/errorHandler.js";

function resolveEmployeeId(req) {
  return req.user?.employeeId || CURRENT_EMPLOYEE_ID;
}

export let messageController = {
  listConversations: (req, res) => {
    res.json({ success: true, data: Message.listConversations(resolveEmployeeId(req)) });
  },

  getConversation: (req, res) => {
    let data = Message.getConversation(req.params.id, resolveEmployeeId(req));
    if (!data) throw new ApiError(404, "Conversation not found");
    res.json({ success: true, data });
  },

  listMessages: (req, res) => {
    let { page, pageSize } = req.query;
    let result = Message.listMessages(req.params.id, resolveEmployeeId(req), { page, pageSize });
    if (!result) throw new ApiError(404, "Conversation not found");
    res.json({ success: true, ...result });
  },

  sendMessage: async (req, res) => {
    let { content, attachments } = req.body;
    let data = await Message.sendMessage(req.params.id, { content, attachments }, resolveEmployeeId(req));
    if (!data) throw new ApiError(404, "Conversation not found");
    res.status(201).json({ success: true, data });
  },

  markRead: async (req, res) => {
    let data = await Message.markConversationRead(req.params.id, resolveEmployeeId(req));
    res.json({ success: true, data });
  },

  // Admin-only channel management — create/list channels, add or remove members.
  listAllChannels: (req, res) => {
    res.json({ success: true, data: Message.listAllChannels() });
  },

  createChannel: async (req, res) => {
    let data = await Message.createChannel(req.body, resolveEmployeeId(req));
    res.status(201).json({ success: true, data });
  },

  addChannelMember: async (req, res) => {
    let data = await Message.addChannelMember(req.params.id, req.body.employeeId);
    if (!data) throw new ApiError(404, "Channel not found");
    res.status(201).json({ success: true, data });
  },

  removeChannelMember: async (req, res) => {
    let data = await Message.removeChannelMember(req.params.id, req.params.employeeId);
    if (!data) throw new ApiError(404, "Channel not found");
    res.json({ success: true, data });
  },
};
