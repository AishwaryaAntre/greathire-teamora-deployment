import { channels, directConversations, messages, getReadStateFor, avatarFor } from "../data/messagesStore.js";
import { Employee } from "./Employee.js";
import { generateId } from "../utils/id.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";

function isMember(conversation, employeeId) {
  return conversation.memberIds ? conversation.memberIds.includes(employeeId) : conversation.participantIds.includes(employeeId);
}

function allConversationsFor(employeeId) {
  let chans = channels.filter((c) => isMember(c, employeeId)).map((c) => ({ ...c, type: "channel", label: c.name }));
  let dms = directConversations
    .filter((c) => isMember(c, employeeId))
    .map((c) => {
      let otherId = c.participantIds.find((id) => id !== employeeId);
      let other = Employee.getById(otherId);
      return { ...c, type: "dm", label: other?.name || "Unknown", otherEmployeeId: otherId };
    });
  return [...chans, ...dms];
}

function conversationMessages(conversationId) {
  return messages
    .filter((m) => m.conversationId === conversationId)
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

function timeLabel(iso) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function toMessageDto(m) {
  let sender = m.senderId === "system" ? null : Employee.getById(m.senderId);
  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    senderName: sender?.name || "System",
    senderAvatar: sender ? avatarFor(m.senderId) : null,
    content: m.content,
    attachments: m.attachments || [],
    createdAt: m.createdAt,
    time: timeLabel(m.createdAt),
    isOwn: m.senderId === CURRENT_EMPLOYEE_ID,
  };
}

export let Message = {
  /** GET /api/messages/conversations — channels + DMs, sidebar shape. */
  listConversations(employeeId = CURRENT_EMPLOYEE_ID) {
    let read = getReadStateFor(employeeId);
    return allConversationsFor(employeeId).map((c) => {
      let all = conversationMessages(c.id);
      let last = all[all.length - 1];
      let lastReadISO = read[c.id];
      let unread = all.filter((m) => m.senderId !== employeeId && (!lastReadISO || new Date(m.createdAt) > new Date(lastReadISO))).length;

      return {
        id: c.id,
        type: c.type,
        label: c.label,
        avatar: c.type === "dm" ? avatarFor(c.otherEmployeeId) : null,
        lastMessage: last ? last.content : null,
        lastMessageAt: last ? last.createdAt : null,
        unread,
      };
    });
  },

  /** GET /api/messages/conversations/:id — header info + activity + shared files/links. */
  getConversation(conversationId, employeeId = CURRENT_EMPLOYEE_ID) {
    let conversation = allConversationsFor(employeeId).find((c) => c.id === conversationId);
    if (!conversation) return null;

    let all = conversationMessages(conversationId);
    let sharedFiles = all.flatMap((m) => (m.attachments || []).filter((a) => a.type === "file").map((a) => ({ ...a, from: m.senderId, at: m.createdAt })));
    let sharedLinks = all.flatMap((m) => (m.attachments || []).filter((a) => a.type === "link").map((a) => ({ ...a, from: m.senderId, at: m.createdAt })));

    let contact = null;
    if (conversation.type === "dm") {
      let other = Employee.getById(conversation.otherEmployeeId);
      contact = { id: other.id, name: other.name, role: other.role, avatar: avatarFor(other.id), status: "Active now" };
    }

    return {
      id: conversation.id,
      type: conversation.type,
      label: conversation.label,
      contact,
      sharedFiles,
      sharedLinks,
    };
  },

  /** GET /api/messages/conversations/:id/messages */
  listMessages(conversationId, employeeId = CURRENT_EMPLOYEE_ID) {
    let conversation = allConversationsFor(employeeId).find((c) => c.id === conversationId);
    if (!conversation) return null;
    return conversationMessages(conversationId).map(toMessageDto);
  },

  /** POST /api/messages/conversations/:id/messages */
  sendMessage(conversationId, { content, attachments = [] }, employeeId = CURRENT_EMPLOYEE_ID) {
    let conversation = allConversationsFor(employeeId).find((c) => c.id === conversationId);
    if (!conversation) return null;

    let message = {
      id: generateId("msg"),
      conversationId,
      senderId: employeeId,
      content,
      attachments,
      createdAt: new Date().toISOString(),
    };
    messages.push(message);

    let read = getReadStateFor(employeeId);
    read[conversationId] = message.createdAt;

    return toMessageDto(message);
  },

  /** POST /api/messages/conversations/:id/read */
  markConversationRead(conversationId, employeeId = CURRENT_EMPLOYEE_ID) {
    let read = getReadStateFor(employeeId);
    read[conversationId] = new Date().toISOString();
    return { conversationId, readAt: read[conversationId] };
  },
};
