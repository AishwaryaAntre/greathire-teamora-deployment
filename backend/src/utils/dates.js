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

/** "2 mins ago" / "3 hours ago" / "5 days ago" style relative label for activity feeds. */
export function timeAgo(isoTimestamp) {
  let diffMs = Date.now() - new Date(isoTimestamp).getTime();
  let minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

  let hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  let days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function isWeekend(date) {
  let day = new Date(date).getDay();
  return day === 0 || day === 6;
}

/** "08:45 AM" -> 525 (minutes since midnight). */
export function parseClockToMinutes(clockStr) {
  let [time, period] = clockStr.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/** 525 -> { time: "08:45", period: "AM" } */
export function formatMinutesToClock(totalMinutes) {
  let wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  let h = Math.floor(wrapped / 60);
  let m = Math.round(wrapped % 60);
  let period = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return { time: `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}`, period };
}

/** 4.3 (hours) -> "04:18" */
export function formatHoursDecimalToClock(hoursDecimal) {
  let totalMinutes = Math.round(hoursDecimal * 60);
  let h = Math.floor(totalMinutes / 60);
  let m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
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
