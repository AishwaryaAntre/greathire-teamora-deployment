import { employees } from "./employees.js";
import { generateId } from "../utils/id.js";
import { addDays, toISODate, daysBetweenInclusive } from "../utils/dates.js";

const LEAVE_TYPES = ["Annual", "Sick Leave", "Casual", "Unpaid"];
const STATUSES = ["Pending", "Approved", "Rejected"];

function seedLeaveRequests() {
  const today = new Date();
  const seedRows = [
    { empIdx: 2, type: "Annual", startOffset: 4, span: 5, status: "Pending", reason: "Family trip" },
    { empIdx: 3, type: "Sick Leave", startOffset: -3, span: 2, status: "Approved", reason: "Flu recovery" },
    { empIdx: 0, type: "Casual", startOffset: 1, span: 1, status: "Pending", reason: "Personal errand" },
    { empIdx: 6, type: "Annual", startOffset: 10, span: 3, status: "Pending", reason: "Wedding" },
    { empIdx: 5, type: "Sick Leave", startOffset: -1, span: 1, status: "Approved", reason: "Doctor appointment" },
    { empIdx: 8, type: "Unpaid", startOffset: 15, span: 4, status: "Pending", reason: "Relocation" },
    { empIdx: 9, type: "Annual", startOffset: -10, span: 2, status: "Rejected", reason: "Overlaps sprint freeze" },
    { empIdx: 10, type: "Casual", startOffset: 2, span: 1, status: "Approved", reason: "Home repair" },
  ];

  return seedRows.map((row) => {
    const employee = employees[row.empIdx];
    const start = toISODate(addDays(today, row.startOffset));
    const end = toISODate(addDays(today, row.startOffset + row.span - 1));
    return {
      id: generateId("lv"),
      employeeId: employee.id,
      leaveType: row.type,
      startDate: start,
      endDate: end,
      durationDays: daysBetweenInclusive(start, end),
      status: row.status,
      reason: row.reason,
      appliedOn: toISODate(addDays(today, row.startOffset - 3)),
      decidedOn: row.status === "Pending" ? null : toISODate(addDays(today, row.startOffset - 1)),
    };
  });
}

export const leaveRequests = seedLeaveRequests();

export const LEAVE_TYPE_OPTIONS = LEAVE_TYPES;
export const LEAVE_STATUS_OPTIONS = STATUSES;
