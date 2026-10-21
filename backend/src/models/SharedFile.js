import { SharedFileModel } from "../db/schemas.js";

export const SharedFile = {
  createPending(file) {
    return SharedFileModel.create(file);
  },

  findById(conversationId, id) {
    return SharedFileModel.findOne({ conversationId, id });
  },

  listForConversation(conversationId) {
    return SharedFileModel.find({ conversationId, status: "ready" })
      .sort({ createdAt: -1 })
      .lean();
  },

  markReady(id) {
    return SharedFileModel.findOneAndUpdate(
      { id, status: "pending" },
      { $set: { status: "ready" } },
      { new: true }
    );
  },

  deletePending(id) {
    return SharedFileModel.deleteOne({ id, status: "pending" });
  },

  deletePendingById(conversationId, id) {
    return SharedFileModel.findOneAndDelete({ conversationId, id, status: "pending" });
  },
};
