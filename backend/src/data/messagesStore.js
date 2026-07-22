import { employees, CURRENT_EMPLOYEE_ID } from "./employees.js";
import { generateId } from "../utils/id.js";

function empIdx(id) {
  return employees.findIndex((e) => e.id === id);
}
function avatarFor(employeeId) {
  return `https://i.pravatar.cc/64?img=${10 + Math.max(empIdx(employeeId), 0)}`;
}

// --- Channels (team-wide, topic-based) ---
export let channels = [
  { id: "chan_general", name: "General", memberIds: employees.map((e) => e.id) },
  { id: "chan_engineering", name: "Engineering", memberIds: employees.filter((e) => e.department === "Engineering").map((e) => e.id) },
  { id: "chan_frontend", name: "Frontend", memberIds: ["emp_001", "emp_002", "emp_013"] },
  { id: "chan_backend", name: "Backend", memberIds: ["emp_003", "emp_012", "emp_013"] },
  { id: "chan_devops", name: "DevOps", memberIds: ["emp_008", "emp_013"] },
];

// --- Direct message threads (always between CURRENT_EMPLOYEE_ID and one colleague, for this demo) ---
export let directConversations = [
  { id: "dm_emp001", participantIds: ["emp_001", CURRENT_EMPLOYEE_ID] },
  { id: "dm_emp003", participantIds: ["emp_003", CURRENT_EMPLOYEE_ID] },
  { id: "dm_emp006", participantIds: ["emp_006", CURRENT_EMPLOYEE_ID] },
];

function minutesAgo(m) {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

// --- Seed messages, keyed by conversationId ---
export let messages = [
  {
    id: generateId("msg"),
    conversationId: "chan_engineering",
    senderId: "emp_003",
    content: "Deploy for the attendance service is live on staging, please test check-in/out.",
    createdAt: minutesAgo(120),
    attachments: [],
  },
  {
    id: generateId("msg"),
    conversationId: "chan_engineering",
    senderId: CURRENT_EMPLOYEE_ID,
    content: "On it — will run through the leave approval flow too.",
    createdAt: minutesAgo(90),
    attachments: [],
  },
  {
    id: generateId("msg"),
    conversationId: "chan_engineering",
    senderId: "emp_006",
    content: "Sprint report is attached below.",
    createdAt: minutesAgo(60),
    attachments: [{ type: "file", name: "Sprint_Report.pdf", note: "2.4 MB" }],
  },
  {
    id: generateId("msg"),
    conversationId: "dm_emp001",
    senderId: "emp_001",
    content: "Hey! Did you get a chance to review the dashboard UI mockups?",
    createdAt: minutesAgo(45),
    attachments: [{ type: "file", name: "Dashboard_UI_v2.fig", note: "Shared" }],
  },
  {
    id: generateId("msg"),
    conversationId: "dm_emp001",
    senderId: CURRENT_EMPLOYEE_ID,
    content: "Yes, looks great! Left a couple of comments on the sidebar spacing.",
    createdAt: minutesAgo(30),
    attachments: [],
  },
  {
    id: generateId("msg"),
    conversationId: "dm_emp001",
    senderId: "emp_001",
    content: "Here's the repo link in case you want to pull the branch: github.com/greathire/teamora",
    createdAt: minutesAgo(20),
    attachments: [{ type: "link", label: "github.com/greathire/teamora", note: "Sent today" }],
  },
];

// --- Per-employee read state: { [employeeId]: { [conversationId]: lastReadISO } } ---
export let readState = {
  [CURRENT_EMPLOYEE_ID]: {
    chan_general: minutesAgo(0),
    chan_engineering: minutesAgo(65), // leaves the emp_006 message unread on purpose
    dm_emp001: minutesAgo(0),
  },
};

export function getReadStateFor(employeeId) {
  if (!readState[employeeId]) readState[employeeId] = {};
  return readState[employeeId];
}

export { avatarFor };
