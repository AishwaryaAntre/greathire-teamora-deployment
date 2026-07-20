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

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysBetweenInclusive(startISO, endISO) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  return Math.round((end - start) / DAY_MS) + 1;
}

export function isSameMonth(dateISO, referenceDate = new Date()) {
  const d = new Date(dateISO);
  return (
    d.getFullYear() === referenceDate.getFullYear() &&
    d.getMonth() === referenceDate.getMonth()
  );
}

export function isLastMonth(dateISO, referenceDate = new Date()) {
  const ref = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
  const d = new Date(dateISO);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/** Formats an ISO date range like "Oct 12 - Oct 16". */
export function formatDateRange(startISO, endISO) {
  const opts = { month: "short", day: "2-digit" };
  const start = new Date(startISO).toLocaleDateString("en-US", opts);
  const end = new Date(endISO).toLocaleDateString("en-US", opts);
  return `${start} - ${end}`;
}

/** "2 mins ago" / "3 hours ago" / "5 days ago" style relative label for activity feeds. */
export function timeAgo(isoTimestamp) {
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function formatPrettyDate(dateISO) {
  return new Date(dateISO).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/**
 * Maps a `range` query param ("7d" | "30d" | "12m") to a cutoff Date,
 * mirroring the "7 Days / 30 Days / 12 Months" tabs on the Reports page.
 */
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
