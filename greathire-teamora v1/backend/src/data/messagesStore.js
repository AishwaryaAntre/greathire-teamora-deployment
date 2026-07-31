import { ChannelModel, DirectConversationModel, MessageModel, ReadStateModel } from "../db/schemas.js";
import { employees } from "./employees.js";

function empIdx(id) {
  return employees.findIndex((e) => e.id === id);
}
function avatarFor(employeeId) {
  return `https://i.pravatar.cc/64?img=${10 + Math.max(empIdx(employeeId), 0)}`;
}

export let channels = [];
export let directConversations = [];
export let messages = [];

/** { [employeeId]: { [conversationId]: lastReadISO } } */
let readState = {};

export async function loadMessaging() {
  let [channelDocs, dmDocs, messageDocs, readDocs] = await Promise.all([
    ChannelModel.find().lean(),
    DirectConversationModel.find().lean(),
    MessageModel.find().lean(),
    ReadStateModel.find().lean(),
  ]);

  channels.length = 0;
  channels.push(...channelDocs.map(({ _id, ...rest }) => rest));

  directConversations.length = 0;
  directConversations.push(...dmDocs.map(({ _id, ...rest }) => rest));

  messages.length = 0;
  messages.push(...messageDocs.map(({ _id, ...rest }) => rest));

  readState = {};
  readDocs.forEach((doc) => {
    if (!readState[doc.employeeId]) readState[doc.employeeId] = {};
    readState[doc.employeeId][doc.conversationId] = doc.lastReadISO;
  });

  return { channels, directConversations, messages, readState };
}

export function getReadStateFor(employeeId) {
  if (!readState[employeeId]) readState[employeeId] = {};
  return readState[employeeId];
}

export async function persistNewMessage(message) {
  messages.push(message);
  await MessageModel.create(message);
  return message;
}

export async function persistReadState(employeeId, conversationId, lastReadISO) {
  await ReadStateModel.updateOne(
    { employeeId, conversationId },
    { $set: { lastReadISO } },
    { upsert: true }
  );
}

export { avatarFor };
