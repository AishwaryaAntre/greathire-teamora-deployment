import { employees, CURRENT_EMPLOYEE_ID } from "./employees.js";
import { generateId } from "../utils/id.js";

function employeeAvatarSeed(employeeId) {
  let idx = employees.findIndex((e) => e.id === employeeId);
  return 10 + (idx >= 0 ? idx : 0);
}

// category: "attendance" | "leave" | "system"
// priority: "low" | "medium" | "high"
let seed = [
  {
    type: "check-in",
    category: "attendance",
    title: "Attendance Log",
    description: "Aarav Mehta checked in at 09:02 AM",
    priority: "low",
    minutesAgo: 2,
    read: false,
    isSystem: false,
    relatedEmployeeId: "emp_001",
  },
  {
    type: "break-start",
    category: "attendance",
    title: "Break Started",
    description: "Neha Sharma started a break",
    priority: "medium",
    minutesAgo: 15,
    read: false,
    isSystem: false,
    relatedEmployeeId: "emp_002",
  },
  {
    type: "report-generated",
    category: "system",
    title: "System Alert",
    description: "Attendance report generated successfully",
    priority: "low",
    minutesAgo: 60,
    read: true,
    isSystem: true,
    relatedEmployeeId: null,
  },
  {
    type: "leave-requested",
    category: "leave",
    title: "Leave Request",
    description: "Marcus Vance requested 2 days of paid leave",
    priority: "high",
    minutesAgo: 90,
    read: false,
    isSystem: false,
    relatedEmployeeId: "emp_003",
  },
  {
    type: "leave-approved",
    category: "leave",
    title: "Leave Approved",
    description: "Your leave request for Oct 18-19 was approved",
    priority: "medium",
    minutesAgo: 240,
    read: false,
    isSystem: false,
    relatedEmployeeId: CURRENT_EMPLOYEE_ID,
  },
];

export let notifications = seed.map((n, i) => ({
  id: generateId("notif"),
  ...n,
  avatar: n.relatedEmployeeId
    ? `https://i.pravatar.cc/64?img=${employeeAvatarSeed(n.relatedEmployeeId)}`
    : null,
  createdAt: new Date(Date.now() - n.minutesAgo * 60 * 1000).toISOString(),
  // Every notification is addressed to the self-service employee for this in-memory demo;
  // swap for a real recipient/employeeId column once a proper multi-user DB is in place.
  recipientEmployeeId: CURRENT_EMPLOYEE_ID,
}));

export let notificationPreferences = {
  [CURRENT_EMPLOYEE_ID]: {
    email: true,
    push: true,
    attendanceAlerts: true,
    leaveAlerts: true,
    systemAlerts: false,
  },
};

export function getPreferencesFor(employeeId) {
  if (!notificationPreferences[employeeId]) {
    notificationPreferences[employeeId] = {
      email: true,
      push: true,
      attendanceAlerts: true,
      leaveAlerts: true,
      systemAlerts: false,
    };
  }
  return notificationPreferences[employeeId];
}
