export const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns YYYY-MM-DD for a Date object (local time, no timezone shift). */
export function toISODate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

/** Midnight (00:00:00.000) of the given date, in local time. */
export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Last instant (23:59:59.999) of the given date, in local time. */
export function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysBetweenInclusive(start, end) {
  return Math.round((startOfDay(end) - startOfDay(start)) / DAY_MS) + 1;
}

export function isSameMonth(date, referenceDate = new Date()) {
  const d = new Date(date);
  return d.getFullYear() === referenceDate.getFullYear() && d.getMonth() === referenceDate.getMonth();
}

export function isLastMonth(date, referenceDate = new Date()) {
  const ref = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
  const d = new Date(date);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/** Formats a date range like "Oct 12 - Oct 16". */
export function formatDateRange(start, end) {
  const opts = { month: "short", day: "2-digit" };
  return `${new Date(start).toLocaleDateString("en-US", opts)} - ${new Date(end).toLocaleDateString("en-US", opts)}`;
}

/** "2 mins ago" / "3 hours ago" / "5 days ago" relative label for activity/notification feeds. */
export function timeAgo(timestamp) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatPrettyDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/** Maps a `range` query param ("7d" | "30d" | "12m") to a cutoff Date. */
export function rangeToCutoff(range = "12m") {
  const now = new Date();
  switch (range) {
    case "7d":
      return addDays(now, -7);
    case "30d":
      return addDays(now, -30);
    case "12m":
    default:
      return addDays(now, -365);
  }
}
