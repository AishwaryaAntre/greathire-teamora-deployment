export let DAY_MS = 24 * 60 * 60 * 1000;

/** Returns YYYY-MM-DD for a Date object (local time, no timezone shift). */
export function toISODate(date) {
  let d = new Date(date);
  let year = d.getFullYear();
  let month = String(d.getMonth() + 1).padStart(2, "0");
  let day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(date, days) {
  let d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function daysBetweenInclusive(startISO, endISO) {
  let start = new Date(startISO);
  let end = new Date(endISO);
  return Math.round((end - start) / DAY_MS) + 1;
}

export function isSameMonth(dateISO, referenceDate = new Date()) {
  let d = new Date(dateISO);
  return (
    d.getFullYear() === referenceDate.getFullYear() &&
    d.getMonth() === referenceDate.getMonth()
  );
}

export function isLastMonth(dateISO, referenceDate = new Date()) {
  let ref = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1);
  let d = new Date(dateISO);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

/** Formats an ISO date range like "Oct 12 - Oct 16". */
export function formatDateRange(startISO, endISO) {
  let opts = { month: "short", day: "2-digit" };
  let start = new Date(startISO).toLocaleDateString("en-US", opts);
  let end = new Date(endISO).toLocaleDateString("en-US", opts);
  return `${start} - ${end}`;
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
  let now = new Date();
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
