import bcrypt from "bcryptjs";
import { generateId } from "../utils/id.js";
import { addDays, toISODate, daysBetweenInclusive } from "../utils/dates.js";
import {
  EmployeeModel,
  UserModel,
  AttendanceModel,
  ActivityModel,
  LeaveRequestModel,
  NotificationModel,
  NotificationPreferenceModel,
  ChannelModel,
  DirectConversationModel,
  MessageModel,
  ReadStateModel,
  AnnouncementModel,
  HolidayModel,
} from "./schemas.js";
import { logger } from "../config/logger.js";

export const CURRENT_EMPLOYEE_ID = "emp_013";

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------
function buildEmployees() {
  let base = [
    { id: "emp_001", name: "Leila Kabir", role: "Senior Engineer", department: "Engineering", initials: "PS", joiningDate: "2021-04-12" },
    { id: "emp_002", name: "Atul Ruia", role: "Product Designer", department: "Design", initials: "JD", joiningDate: "2022-01-10" },
    { id: "emp_003", name: "Elon Musk", role: "Senior Developer", department: "Engineering", initials: "MV", joiningDate: "2020-09-01" },
    { id: "emp_004", name: "Vikas Oberoi", role: "Product Manager", department: "Product", initials: "ER", joiningDate: "2019-06-17" },
    { id: "emp_005", name: "Rajiv Singh", role: "HR Director", department: "Human Resources", initials: "SJ", joiningDate: "2018-03-05" },
    { id: "emp_006", name: "Irfan Razack", role: "QA Engineer", department: "Engineering", initials: "DK", joiningDate: "2022-11-21" },
    { id: "emp_007", name: "Pirojsha Godrej", role: "Marketing Lead", department: "Marketing", initials: "AO", joiningDate: "2021-02-14" },
    { id: "emp_008", name: "Payal Shinde", role: "DevOps Engineer", department: "Engineering", initials: "LC", joiningDate: "2023-05-30" },
    { id: "emp_009", name: "Pranave Masurkar", role: "Finance Analyst", department: "Finance", initials: "FA", joiningDate: "2020-01-20" },
    { id: "emp_010", name: "Prame Manjule", role: "Sales Executive", department: "Sales", initials: "TB", joiningDate: "2022-07-08" },
    { id: "emp_011", name: "Nitin gadkari", role: "UX Researcher", department: "Design", initials: "NP", joiningDate: "2021-10-04" },
    { id: "emp_012", name: "Aviraj Patel", role: "Backend Engineer", department: "Engineering", initials: "RP", joiningDate: "2023-02-27" },
    { id: "emp_013", name: "Sanjay Dutt", role: "Software Engineer", department: "Engineering", initials: "SK", joiningDate: "2022-03-14" },
  ];

  function slugEmail(name) {
    return name.toLowerCase().replace(/[^a-z\s]/g, "").trim().replace(/\s+/g,"") + "@greathire.com";
  }
  function employeeCode(id) {
    let n = id.replace("emp_", "");
    return `GH-1${n}`;
  }
  function seededScore(id, min, max) {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    return min + (hash % (max - min + 1));
  }
  function seedDocuments(name) {
    let firstName = name.split(" ")[0];
    return [
      { name: "Offer_Letter.pdf", note: "Added on joining", type: "pdf" },
      { name: "ID_Proof_Passport.pdf", note: "Verified", type: "image" },
      { name: `Resume_${firstName}.pdf`, note: "On file", type: "image" },
    ];
  }

  return base.map((e) => ({
    ...e,
    avatar: null,
    employeeCode: employeeCode(e.id),
    email: slugEmail(e.name),
    phone: `+91896${seededScore(e.id + "phone", 100, 999)}${seededScore(e.id + "phone2", 1000, 9999)}`,
    performanceScore: seededScore(e.id + "perf", 82, 98),
    taskLoadPercent: seededScore(e.id + "load", 35, 85),
    leaveAllocation: { casual: 6, paid: 12, sick: 4 },
    leaveAccrual: 0,
    documents: seedDocuments(e.name),
  }));
}

// ---------------------------------------------------------------------------
// Attendance (60 days, seeded PRNG so it's stable across reseeds)
// ---------------------------------------------------------------------------
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildAttendance(employees, daysBack = 60) {
  let STATUSES = ["Present", "Present", "Present", "Present", "Late", "Absent"];
  let rand = mulberry32(42);
  let pick = (list) => list[Math.floor(rand() * list.length)];

  function buildRecord(employee, date) {
    let isWeekend = [0, 6].includes(date.getDay());
    let status = isWeekend ? "Weekend" : pick(STATUSES);

    let checkIn = null;
    let checkOut = null;
    let hoursWorked = 0;
    let late = false;
    let liveStatus = null;

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
      status,
      liveStatus,
      checkIn,
      checkOut,
      late,
      hoursWorked,
    };
  }

  let records = [];
  let today = new Date();
  for (let i = 0; i < daysBack; i += 1) {
    let date = addDays(today, -i);
    employees.forEach((employee) => records.push(buildRecord(employee, date)));
  }
  return records;
}

function buildActivity(employees) {
  let [p0, p1, p2] = employees;
  let minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();
  return [
    { id: generateId("act"), type: "check-in", employeeId: p0.id, text: `${p0.name} checked in`, timestamp: minutesAgo(2) },
    { id: generateId("act"), type: "break", employeeId: p2.id, text: `${p2.name} started break`, timestamp: minutesAgo(15) },
    { id: generateId("act"), type: "check-in", employeeId: p1.id, text: `${p1.name} checked in`, timestamp: minutesAgo(45) },
  ];
}

function buildLeaveRequests(employees) {
  let today = new Date();
  let seedRows = [
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

function buildNotifications() {
  let seed = [
    { type: "check-in", category: "attendance", title: "Attendance Log", description: "Aarav Mehta checked in at 09:02 AM", priority: "low", minutesAgo: 2, read: false, isSystem: false, relatedEmployeeId: "emp_001" },
    { type: "break-start", category: "attendance", title: "Break Started", description: "Neha Sharma started a break", priority: "medium", minutesAgo: 15, read: false, isSystem: false, relatedEmployeeId: "emp_002" },
    { type: "report-generated", category: "system", title: "System Alert", description: "Attendance report generated successfully", priority: "low", minutesAgo: 60, read: true, isSystem: true, relatedEmployeeId: null },
    { type: "leave-requested", category: "leave", title: "Leave Request", description: "Marcus Vance requested 2 days of paid leave", priority: "high", minutesAgo: 90, read: false, isSystem: false, relatedEmployeeId: "emp_003" },
    { type: "leave-approved", category: "leave", title: "Leave Approved", description: "Your leave request for Oct 18-19 was approved", priority: "medium", minutesAgo: 240, read: false, isSystem: false, relatedEmployeeId: CURRENT_EMPLOYEE_ID },
  ];

  function employeeAvatarSeed(employees, employeeId) {
    let idx = employees.findIndex((e) => e.id === employeeId);
    return 10 + (idx >= 0 ? idx : 0);
  }

  return (employees) =>
    seed.map((n) => ({
      id: generateId("notif"),
      ...n,
      avatar: n.relatedEmployeeId ? `https://i.pravatar.cc/64?img=${employeeAvatarSeed(employees, n.relatedEmployeeId)}` : null,
      createdAt: new Date(Date.now() - n.minutesAgo * 60 * 1000).toISOString(),
      recipientEmployeeId: CURRENT_EMPLOYEE_ID,
    }));
}

function buildMessagingSeed(employees) {
  let channels = [
    { id: "chan_general", name: "General", memberIds: employees.map((e) => e.id) },
    { id: "chan_engineering", name: "Engineering", memberIds: employees.filter((e) => e.department === "Engineering").map((e) => e.id) },
    { id: "chan_frontend", name: "Frontend", memberIds: ["emp_001", "emp_002", "emp_013"] },
    { id: "chan_backend", name: "Backend", memberIds: ["emp_003", "emp_012", "emp_013"] },
    { id: "chan_devops", name: "DevOps", memberIds: ["emp_008", "emp_013"] },
  ];

  let directConversations = [
    { id: "dm_emp001", participantIds: ["emp_001", CURRENT_EMPLOYEE_ID] },
    { id: "dm_emp003", participantIds: ["emp_003", CURRENT_EMPLOYEE_ID] },
    { id: "dm_emp006", participantIds: ["emp_006", CURRENT_EMPLOYEE_ID] },
  ];

  let minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000).toISOString();

  let messages = [
    { id: generateId("msg"), conversationId: "chan_engineering", senderId: "emp_003", content: "Deploy for the attendance service is live on staging, please test check-in/out.", createdAt: minutesAgo(120), attachments: [] },
    { id: generateId("msg"), conversationId: "chan_engineering", senderId: CURRENT_EMPLOYEE_ID, content: "On it — will run through the leave approval flow too.", createdAt: minutesAgo(90), attachments: [] },
    { id: generateId("msg"), conversationId: "chan_engineering", senderId: "emp_006", content: "Sprint report is attached below.", createdAt: minutesAgo(60), attachments: [{ type: "file", name: "Sprint_Report.pdf", note: "2.4 MB" }] },
    { id: generateId("msg"), conversationId: "dm_emp001", senderId: "emp_001", content: "Hey! Did you get a chance to review the dashboard UI mockups?", createdAt: minutesAgo(45), attachments: [{ type: "file", name: "Dashboard_UI_v2.fig", note: "Shared" }] },
    { id: generateId("msg"), conversationId: "dm_emp001", senderId: CURRENT_EMPLOYEE_ID, content: "Yes, looks great! Left a couple of comments on the sidebar spacing.", createdAt: minutesAgo(30), attachments: [] },
    { id: generateId("msg"), conversationId: "dm_emp001", senderId: "emp_001", content: "Here's the repo link in case you want to pull the branch: github.com/greathire/teamora", createdAt: minutesAgo(20), attachments: [{ type: "link", label: "github.com/greathire/teamora", note: "Sent today" }] },
  ];

  let readState = [
    { employeeId: CURRENT_EMPLOYEE_ID, conversationId: "chan_general", lastReadISO: minutesAgo(0) },
    { employeeId: CURRENT_EMPLOYEE_ID, conversationId: "chan_engineering", lastReadISO: minutesAgo(65) },
    { employeeId: CURRENT_EMPLOYEE_ID, conversationId: "dm_emp001", lastReadISO: minutesAgo(0) },
  ];

  return { channels, directConversations, messages, readState };
}

function buildAnnouncements() {
  return [
    { id: "ann_001", eyebrow: "Announcement", title: "New Hybrid Work Policy", body: "Starting next month, we are transitioning to a flexible 3-day office week. Managers will share team-specific rosters shortly.", ctaLabel: "Read More", postedOn: "2026-07-10" },
    { id: "ann_002", eyebrow: "Announcement", title: "Annual Health Checkup Drive", body: "The on-site health checkup camp runs next week. Book your slot through the HR portal before Friday.", ctaLabel: "Read More", postedOn: "2026-06-28" },
  ];
}

function buildHolidays() {
  let seedOffsets = [
    { offsetDays: 14, name: "Founders' Day", type: "National Holiday" },
    { offsetDays: 40, name: "Harvest Festival", type: "Regional Holiday" },
    { offsetDays: 75, name: "Winter Break", type: "National Holiday" },
    { offsetDays: -20, name: "Spring Festival", type: "Regional Holiday" },
  ];
  let today = new Date();
  return seedOffsets.map(({ offsetDays, name, type }) => ({ date: toISODate(addDays(today, offsetDays)), name, type }));
}

function roleForEmployee(employee) {
  if (employee.id === "emp_005") return "admin";
  return "employee";
}

/**
 * Populates any collection that is still empty with the original demo dataset.
 * Safe to call on every boot — already-seeded (or already-live) collections are
 * left untouched, so real data created by users is never overwritten.
 */
export async function seedDatabaseIfEmpty() {
  if (process.env.SEED_DEMO_DATA === "false") return;

  let employeeCount = await EmployeeModel.countDocuments();
  let employees;
  if (employeeCount === 0) {
    employees = buildEmployees();
    await EmployeeModel.insertMany(employees);
    logger.info(`[seed] inserted ${employees.length} employees`);
  } else {
    employees = await EmployeeModel.find().lean();
  }

  if ((await UserModel.countDocuments()) === 0) {
    let demoPassword = process.env.SEED_USER_PASSWORD || "password123";
    let passwordHash = bcrypt.hashSync(demoPassword, 10);
    let users = employees.map((e) => ({
      id: `user_${e.id.replace("emp_", "")}`,
      employeeId: e.id,
      name: e.name,
      email: e.email,
      passwordHash,
      role: roleForEmployee(e),
      createdAt: new Date().toISOString(),
    }));
    await UserModel.insertMany(users);
    logger.debug(`[seed] inserted ${users.length} users (demo password: ${demoPassword})`);
  }

  if ((await AttendanceModel.countDocuments()) === 0) {
    let records = buildAttendance(employees, 60);
    await AttendanceModel.insertMany(records);
    logger.info(`[seed] inserted ${records.length} attendance records`);
  }

  if ((await ActivityModel.countDocuments()) === 0) {
    await ActivityModel.insertMany(buildActivity(employees));
    logger.info("[seed] inserted activity log");
  }

  if ((await LeaveRequestModel.countDocuments()) === 0) {
    let rows = buildLeaveRequests(employees);
    await LeaveRequestModel.insertMany(rows);
    logger.info(`[seed] inserted ${rows.length} leave requests`);
  }

  if ((await NotificationModel.countDocuments()) === 0) {
    let rows = buildNotifications()(employees);
    await NotificationModel.insertMany(rows);
    logger.info(`[seed] inserted ${rows.length} notifications`);
  }

  if ((await NotificationPreferenceModel.countDocuments()) === 0) {
    await NotificationPreferenceModel.create({
      employeeId: CURRENT_EMPLOYEE_ID,
      email: true,
      push: true,
      attendanceAlerts: true,
      leaveAlerts: true,
      systemAlerts: false,
    });
    logger.info("[seed] inserted notification preferences");
  }

  if ((await ChannelModel.countDocuments()) === 0 && (await DirectConversationModel.countDocuments()) === 0) {
    let { channels, directConversations, messages, readState } = buildMessagingSeed(employees);
    await ChannelModel.insertMany(channels);
    await DirectConversationModel.insertMany(directConversations);
    await MessageModel.insertMany(messages);
    await ReadStateModel.insertMany(readState);
    logger.info(`[seed] inserted ${channels.length} channels, ${directConversations.length} DMs, ${messages.length} messages`);
  }

  if ((await AnnouncementModel.countDocuments()) === 0) {
    await AnnouncementModel.insertMany(buildAnnouncements());
    logger.info("[seed] inserted announcements");
  }

  if ((await HolidayModel.countDocuments()) === 0) {
    await HolidayModel.insertMany(buildHolidays());
    logger.info("[seed] inserted holidays");
  }
}
