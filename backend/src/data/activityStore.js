import { ActivityModel } from "../db/schemas.js";
import { generateId } from "../utils/id.js";
import { logger } from "../config/logger.js";

// dotClass mirrors the frontend's RECENT_ACTIVITY styling per event type.
let TYPE_STYLES = {
  "check-in": "bg-emerald-500",
  "check-out": "bg-slate-400",
  break: "bg-amber-500",
  leave: "bg-rose-500",
};

/** Module-level in-memory "table", newest first, kept in sync with MongoDB. */
export let activityLog = [];

export async function loadActivity() {
  let docs = await ActivityModel.find().sort({ timestamp: -1 }).lean();
  activityLog.length = 0;
  activityLog.push(...docs.map(({ _id, ...rest }) => rest));
  return activityLog;
}

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
  ActivityModel.create(entry).catch((err) => logger.error({ err, type, employeeId }, "[activity] persist failed"));
  return entry;
}

export function getDotClass(type) {
  return TYPE_STYLES[type] || "bg-slate-400";
}
