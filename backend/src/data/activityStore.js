import { employees } from "./employees.js";
import { generateId } from "../utils/id.js";

// dotClass mirrors the frontend's RECENT_ACTIVITY styling per event type.
let TYPE_STYLES = {
  "check-in": "bg-emerald-500",
  "check-out": "bg-slate-400",
  break: "bg-amber-500",
  leave: "bg-rose-500",
};

function minutesAgoTimestamp(minutes) {
  return new Date(Date.now() - minutes * 60000).toISOString();
}

function seedActivity() {
  let [p0, p1, p2] = employees; // Priya Sharma, John Doe, Marcus Vance

  return [
    {
      id: generateId("act"),
      type: "check-in",
      employeeId: p0.id,
      text: `${p0.name} checked in`,
      timestamp: minutesAgoTimestamp(2),
    },
    {
      id: generateId("act"),
      type: "break",
      employeeId: p2.id,
      text: `${p2.name} started break`,
      timestamp: minutesAgoTimestamp(15),
    },
    {
      id: generateId("act"),
      type: "check-in",
      employeeId: p1.id,
      text: `${p1.name} checked in`,
      timestamp: minutesAgoTimestamp(45),
    },
  ];
}

/** Module-level in-memory "table", newest first. Swap for a real DB layer later. */
export let activityLog = seedActivity();

/** Prepend a new activity entry — called by Attendance actions (check-in/check-out/etc). */
export function logActivity(type, employeeId, text) {
  let entry = {
    id: generateId("act"),
    type,
    employeeId,
    text,
    timestamp: new Date().toISOString(),
  };
  activityLog.unshift(entry);
  return entry;
}

export function getDotClass(type) {
  return TYPE_STYLES[type] || "bg-slate-400";
}
