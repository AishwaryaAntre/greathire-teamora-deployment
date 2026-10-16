import { parseClockToMinutes } from "./dates.js";

function clockTimestamp(date, clock) {
  let minutes = parseClockToMinutes(clock);
  return Date.parse(`${date}T00:00:00+05:30`) + minutes * 60_000;
}

function timestampFor(record, timestampKey, clockKey) {
  if (record[timestampKey]) return new Date(record[timestampKey]).getTime();
  if (record[clockKey]) return clockTimestamp(record.date, record[clockKey]);
  return null;
}

export function calculateHoursWorked(record, now = new Date()) {
  let storedHours = Number(record?.hoursWorked) || 0;
  let start = record && timestampFor(record, "checkInAt", "checkIn");
  if (start === null) return storedHours;

  let end = record && timestampFor(record, "checkOutAt", "checkOut");
  if (end === null) {
    if (record.liveStatus !== "Working" && record.liveStatus !== "On Break") return storedHours;
    end = now.getTime();
  }
  if (end < start) end += 24 * 60 * 60 * 1000;

  let breakDuration = Number(record.breakDurationMs) || 0;
  if (record.breakStartedAt) {
    let breakStart = new Date(record.breakStartedAt).getTime();
    if (Number.isFinite(breakStart)) {
      breakDuration += Math.max(0, end - breakStart);
    }
  }

  return Math.max(0, end - start - breakDuration) / 3_600_000;
}
