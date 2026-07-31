import { api } from "../apiClient.js";

export const messagesApi = {
  listConversations: () => api.get("/messages/conversations"),
  getConversation: (id) => api.get(`/messages/conversations/${id}`),
  listMessages: (id) => api.get(`/messages/conversations/${id}/messages`),
  sendMessage: (id, content, attachments) => api.post(`/messages/conversations/${id}/messages`, { content, attachments }),
  markRead: (id) => api.post(`/messages/conversations/${id}/read`),
};
