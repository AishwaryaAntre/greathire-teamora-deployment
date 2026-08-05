import { AttendanceModel } from "../db/schemas.js";
import { toISODate } from "../utils/dates.js";

/** Module-level in-memory cache, kept in sync with MongoDB (loaded at boot,
 * updated on every write). Swapped in for the old seeded-array version. */
export let attendanceRecords = [];

export async function loadAttendance() {
  let docs = await AttendanceModel.find().lean();
  attendanceRecords.length = 0;
  attendanceRecords.push(...docs.map(({ _id, ...rest }) => rest));
  return attendanceRecords;
}

export function findTodayRecord(employeeId) {
  let today = toISODate(new Date());
  return attendanceRecords.find((r) => r.employeeId === employeeId && r.date === today);
}

/** Inserts a brand-new record into the cache + MongoDB. */
export async function persistNewAttendance(record) {
  attendanceRecords.unshift(record);
  await AttendanceModel.create(record);
  return record;
}

/** Persists an in-place mutation of an existing (already-in-cache) record. */
export async function persistAttendanceUpdate(record) {
  let { id, ...rest } = record;
  await AttendanceModel.updateOne({ id }, { $set: rest });
  return record;
}

/** Removes every attendance record for a deleted employee, so nothing is left
 * pointing at an id that no longer resolves (Attendance/Dashboard models join
 * records back to Employee.getById and don't guard against a null result). */
export async function deleteAttendanceByEmployeeId(employeeId) {
  for (let i = attendanceRecords.length - 1; i >= 0; i--) {
    if (attendanceRecords[i].employeeId === employeeId) attendanceRecords.splice(i, 1);
  }
  await AttendanceModel.deleteMany({ employeeId });
}
