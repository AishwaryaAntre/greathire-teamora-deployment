import { employees } from "./employees.js";
import { generateId } from "../utils/id.js";
import { addDays, toISODate } from "../utils/dates.js";

let STATUSES = ["Present", "Present", "Present", "Present", "Late", "Absent"];

/** Small seeded PRNG so seed data is stable across server restarts. */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let rand = mulberry32(42);

function pick(list) {
  return list[Math.floor(rand() * list.length)];
}

function buildRecord(employee, date) {
  let isWeekend = [0, 6].includes(date.getDay());
  let status = isWeekend ? "Weekend" : pick(STATUSES);

  let checkIn = null;
  let checkOut = null;
  let hoursWorked = 0;
  let late = false;
  let liveStatus = null; // "Working" | "On Break" — only meaningful for today

  if (status === "Present" || status === "Late") {
    late = status === "Late";
    let hour = late ? 9 : 8;
    let minute = late ? 5 + Math.floor(rand() * 30) : 45 + Math.floor(rand() * 15) - 15;
    checkIn = `${String(hour).padStart(2, "0")}:${String(Math.max(0, minute)).padStart(2, "0")} AM`;
    hoursWorked = Math.round((7 + rand() * 2) * 10) / 10;
    checkOut = `0${5 + Math.floor(rand() * 2)}:${String(Math.floor(rand() * 60)).padStart(2, "0")} PM`;
    liveStatus = rand() > 0.85 ? "On Break" : "Working";
  }

  return {
    id: generateId("att"),
    employeeId: employee.id,
    date: toISODate(date),
    status, // Present | Late | Absent | Weekend
    liveStatus, // Working | On Break | null
    checkIn,
    checkOut,
    late,
    hoursWorked,
  };
}

function seedAttendance(daysBack = 60) {
  let records = [];
  let today = new Date();

  for (let i = 0; i < daysBack; i += 1) {
    let date = addDays(today, -i);
    employees.forEach((employee) => {
      records.push(buildRecord(employee, date));
    });
  }
  return records;
}

/** Module-level in-memory "table". Swap this file for a real DB layer later. */
export let attendanceRecords = seedAttendance(60);

export function findTodayRecord(employeeId) {
  let today = toISODate(new Date());
  return attendanceRecords.find(
    (r) => r.employeeId === employeeId && r.date === today
  );
}
