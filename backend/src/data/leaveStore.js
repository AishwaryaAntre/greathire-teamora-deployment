import { employees } from "./employees.js";
import { generateId } from "../utils/id.js";
import { addDays, toISODate, daysBetweenInclusive } from "../utils/dates.js";

let LEAVE_TYPES = ["Annual", "Sick Leave", "Casual", "Unpaid"];
let STATUSES = ["Pending", "Approved", "Rejected"];

function seedLeaveRequests() {
  let today = new Date();
  let seedRows = [
    { empIdx: 2, type: "Annual", startOffset: 4, span: 5, status: "Pending", reason: "Family" },
    { empIdx: 3, type: "Sick Leave", startOffset: -3, span: 2, status: "Approved", reason: "Flu" },
    { empIdx: 0, type: "Casual", startOffset: 1, span: 1, status: "Pending", reason: "Personal" },
    { empIdx: 6, type: "Casual", startOffset: 10, span: 3, status: "Pending", reason: "rest" },
    { empIdx: 5, type: "Sick Leave", startOffset: -1, span: 1, status: "Approved", reason: "Doctor" },
    { empIdx: 8, type: "Unpaid", startOffset: 15, span: 4, status: "Pending", reason: "flu" },
    { empIdx: 9, type: "Annual", startOffset: -10, span: 2, status: "Rejected", reason: "family time" },
    { empIdx: 10, type: "Casual", startOffset: 2, span: 1, status: "Approved", reason: "Home" },
  ];

  return seedRows.map((row) => {
    let employee = employees[row.empIdx];
    let start = toISODate(addDays(today, row.startOffset));
    let end = toISODate(addDays(today, row.startOffset + row.span - 1));
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

export let leaveRequests = seedLeaveRequests();

export let LEAVE_TYPE_OPTIONS = LEAVE_TYPES;
export let LEAVE_STATUS_OPTIONS = STATUSES;
