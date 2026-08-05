// Dummy data powering the Employee Dashboard.
// Swap these for real API responses later — the component tree doesn't
// care where the data comes from.

export const currentUser = {
  name: "Swaraj Kadam",
  role: "Software Engineer",
  avatarUrl: "",
  todayLabel: "Wednesday, 12th Oct 2023",
  lastLogin: "09:02 AM Today",
};

export const currentStatus = {
  state: "Working", // "Working" | "On Break" | "Checked Out"
  checkIn: "09:02 AM",
  currentSession: "4h 18m",
  todaysGoal: "8 Hours",
  taskLoadPercent: 54,
};

export const quickActions = [
  { id: "check-in", label: "Check In", icon: "LogIn", tone: "success" },
  { id: "start-break", label: "Start Break", icon: "Coffee", tone: "warning" },
  { id: "resume-work", label: "Resume Work", icon: "Play", tone: "info" },
  { id: "check-out", label: "Check Out", icon: "LogOut", tone: "danger" },
];

export const hoursStats = [
  { id: "today", label: "Today's Hours", value: "04:18" },
  { id: "weekly", label: "Weekly Hours", value: "32:45" },
  { id: "monthly", label: "Monthly Hours", value: "164:20" },
  { id: "avg-login", label: "Avg. Login", value: "09:12", suffix: "AM" },
];

export const attendanceLegend = [
  { id: "present", label: "Present", color: "bg-emerald-500" },
  { id: "absent", label: "Absent", color: "bg-rose-500" },
  { id: "leave", label: "Leave", color: "bg-blue-500" },
  { id: "late", label: "Late", color: "bg-amber-500" },
];

// status: "present" | "absent" | "leave" | "late" | "weekend" | null (out of month)
export const attendanceMonth = {
  label: "October 2023",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  weeks: [
    [
      { date: 25, status: "muted" },
      { date: 26, status: "muted" },
      { date: 27, status: "muted" },
      { date: 28, status: "muted" },
      { date: 29, status: "muted" },
      { date: 30, status: "weekend" },
      { date: 1, status: "weekend" },
    ],
    [
      { date: 2, status: "present" },
      { date: 3, status: "present" },
      { date: 4, status: "late" },
      { date: 5, status: "present" },
      { date: 6, status: "present" },
      { date: 7, status: "weekend" },
      { date: 8, status: "weekend" },
    ],
    [
      { date: 9, status: "present" },
      { date: 10, status: "present" },
      { date: 11, status: "present" },
      { date: 12, status: "today" },
      { date: 13, status: "present" },
      { date: 14, status: "weekend" },
      { date: 15, status: "weekend" },
    ],
  ],
};

export const timeline = [
  { id: 1, time: "09:02 AM", label: "Checked In", state: "done" },
  { id: 2, time: "11:30 AM", label: "Break Started", state: "warning" },
  { id: 3, time: "11:50 AM", label: "Resumed Work", state: "done" },
  { id: 4, time: null, label: "Pending Check Out", state: "pending" },
];

export const leaveBalances = [
  { id: "casual", label: "Casual Leave", sublabel: "6 days available", value: 6, icon: "MapPin", tone: "blue" },
  { id: "paid", label: "Paid Leave", sublabel: "12 days available", value: 12, icon: "Wallet", tone: "emerald" },
  { id: "sick", label: "Sick Leave", sublabel: "4 days available", value: 4, icon: "HeartPulse", tone: "rose" },
];

export const upcomingHolidays = [
  { id: "dussehra", day: "24", month: "OCT", name: "Dussehra", meta: "Tuesday • National Holiday" },
  { id: "diwali", day: "12", month: "NOV", name: "Diwali Festival", meta: "Sunday • Regional Holiday" },
];

export const quickLinks = [
  { id: "history", label: "Attendance History", icon: "History" },
  { id: "report", label: "Download Report", icon: "Download" },
  { id: "payslip", label: "View Payslip", icon: "FileText" },
  { id: "policies", label: "Company Policies", icon: "ShieldCheck" },
];

export const attendanceSummary = [
  { id: "percent", label: "Attendance %", value: "98%", icon: "Percent", tone: "blue" },
  { id: "present", label: "Present Days", value: "21", icon: "CheckCircle2", tone: "emerald" },
  { id: "late", label: "Late Days", value: "01", icon: "Clock", tone: "amber" },
  { id: "leaves", label: "Leaves Taken", value: "02", icon: "CalendarX2", tone: "rose" },
];

export const announcement = {
  eyebrow: "Announcement",
  title: "New Hybrid Work Policy",
  body: "Starting next month, we are transitioning to a flexible 3-day office week...",
  ctaLabel: "Read More",
};
