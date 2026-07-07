import React from "react";
import {
  Search,
  Bell,
  Settings,
  Download,
  Pencil,
  Eye,
  ClipboardCheck,
  Percent,
  Clock,
  CalendarCheck2,
  CalendarX2,
  LogIn,
  Award,
  Briefcase,
  Folder,
  FileText,
  FileImage,
  Play,
  Calendar,
  Code2,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Static data                                                                */
/* -------------------------------------------------------------------------- */

const employee = {
  name: "Swaraj Kadam",
  role: "Software Engineer",
  id: "GH-1025",
  status: "WORKING",
  avatar: "https://i.pravatar.cc/160?img=51",
  breadcrumb: ["Directory", "Engineering", "Swaraj Kadam"],
};

const statCards = [
  {
    label: "Attendance %",
    value: "98%",
    icon: Percent,
    note: "2% vs last month",
    noteTone: "up",
  },
  {
    label: "Monthly Hrs",
    value: "164h",
    icon: Clock,
    note: "Target: 160h",
    noteTone: "neutral",
  },
  {
    label: "Present Days",
    value: "21",
    icon: CalendarCheck2,
    note: "Out of 22 working days",
    noteTone: "neutral",
  },
  {
    label: "Leave Balance",
    value: "12",
    icon: CalendarX2,
    note: "3 planned upcoming",
    noteTone: "neutral",
  },
  {
    label: "Avg. Login",
    value: "09:12",
    valueSuffix: "AM",
    icon: LogIn,
    note: "On time average",
    noteTone: "up",
  },
  {
    label: "Perf. Score",
    value: "94%",
    icon: Award,
    note: "Top 10% in dept",
    noteTone: "up",
  },
];

const workSummary = [
  { label: "TODAY", value: "06h 45m" },
  { label: "THIS WEEK", value: "38h 12m" },
  { label: "AVG BREAK/DAY", value: "45m" },
  { label: "CURRENT SESSION", value: "02h 15m", live: true },
];

const personalInfo = [
  { label: "Employee ID", value: "GH-1025" },
  { label: "Department", value: "Engineering (Frontend)" },
  { label: "Joining Date", value: "14 March, 2022 (2y 8m)" },
  {
    label: "Contact",
    value: "swaraj.kadam@greathire.com",
    secondary: "+1 (555) 019-2834",
  },
];

const documents = [
  { name: "Offer_Letter.pdf", note: "Added Mar 10, 2022", icon: FileText },
  { name: "ID_Proof_Passport.pdf", note: "Verified Mar 14, 2022", icon: FileImage },
  { name: "Resume_2022.pdf", note: "Added Mar 01, 2022", icon: FileImage },
];

// 5 rows (M..F visually only labels M / W / F shown) x 7 columns of activity intensity 0-4
const activityMap = [
  [1, 2, 3, 4, 3],
  [2, 3, 2, 1, 0],
  [3, 4, 1, 2, 3],
  [1, 0, 2, 3, 2],
  [0, 1, 1, 2, 2],
  [1, 1, 0, 1, 1],
  [0, 0, 1, 0, 0],
];

const intensityClasses = [
  "bg-slate-100",
  "bg-blue-200",
  "bg-blue-400",
  "bg-blue-600",
  "bg-blue-800",
];

/* -------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* -------------------------------------------------------------------------- */

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <h1 className="text-slate-900 font-semibold text-lg whitespace-nowrap">
        GreatHire WorkTrack
      </h1>

      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2.5 w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search employees, reports..."
          className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
        />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <span className="hidden lg:inline text-sm font-medium text-slate-600">
          System Status
        </span>
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700">
          <Settings className="w-5 h-5" />
        </button>
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white">
          <img
            src="https://i.pravatar.cc/72?img=12"
            alt="Current user"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Breadcrumb + actions                                                      */
/* -------------------------------------------------------------------------- */

function PageActions() {
  return (
    <div className="flex items-center justify-between mb-6">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        {employee.breadcrumb.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i > 0 && <span>›</span>}
            <span
              className={
                i === employee.breadcrumb.length - 1
                  ? "text-slate-700 font-medium"
                  : ""
              }
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>

      <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
        <Download className="w-4 h-4" />
        Export Report
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Profile header card                                                       */
/* -------------------------------------------------------------------------- */

function ProfileHeaderCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={employee.avatar}
          alt={employee.name}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">
          {employee.name}
        </h2>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-400" />
          {employee.role}
          <span className="text-slate-300">|</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono text-xs">
            ID: {employee.id}
          </span>
        </p>
      </div>

      <div className="flex flex-col sm:items-end gap-3">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {employee.status}
        </span>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Pencil className="w-3.5 h-3.5" />
            Edit Employee
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Eye className="w-3.5 h-3.5" />
            View Attendance
          </button>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-3.5 py-2 text-sm font-medium w-fit ml-auto">
          <ClipboardCheck className="w-4 h-4" />
          Approve Leave
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat cards row                                                            */
/* -------------------------------------------------------------------------- */

function StatCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map(({ label, value, valueSuffix, icon: Icon, note, noteTone }) => (
        <div
          key={label}
          className="bg-white rounded-xl border border-slate-200 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <Icon className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {value}
            {valueSuffix && (
              <span className="text-sm font-medium text-slate-400 ml-1">
                {valueSuffix}
              </span>
            )}
          </div>
          <p
            className={`text-xs mt-1 ${
              noteTone === "up"
                ? "text-emerald-500 font-medium"
                : "text-slate-400"
            }`}
          >
            {noteTone === "up" && "↑ "}
            {note}
          </p>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Work Summary + Activity Map                                               */
/* -------------------------------------------------------------------------- */

function WorkSummaryCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-5">
        <Briefcase className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Work Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {workSummary.map(({ label, value, live }) => (
          <div
            key={label}
            className={`rounded-xl p-4 relative ${
              live ? "bg-blue-50" : "bg-slate-50"
            }`}
          >
            <p className="text-[11px] font-medium text-slate-400 tracking-wide mb-2">
              {label}
            </p>
            <p
              className={`text-lg font-bold flex items-center gap-1.5 ${
                live ? "text-blue-600" : "text-slate-900"
              }`}
            >
              {live && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              {value}
            </p>
            {live && (
              <Play className="w-6 h-6 text-blue-300 absolute top-3 right-3 fill-blue-100" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityMapCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 w-full lg:w-72 flex-shrink-0">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Activity Map</h3>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-[10px] text-slate-400 py-0.5">
          <span>M</span>
          <span>W</span>
          <span>F</span>
        </div>
        <div className="grid grid-flow-col grid-rows-5 gap-1">
          {activityMap.map((col, colIdx) =>
            col.map((level, rowIdx) => (
              <span
                key={`${colIdx}-${rowIdx}`}
                className={`w-4 h-4 rounded-sm ${intensityClasses[level]}`}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-[11px] text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          <span className="w-3 h-3 rounded-sm bg-blue-200" />
          <span className="w-3 h-3 rounded-sm bg-blue-400" />
          <span className="w-3 h-3 rounded-sm bg-blue-600" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Personal Info + Documents                                                 */
/* -------------------------------------------------------------------------- */

function PersonalInfoCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900">Personal Info</h3>
        </div>
        <button className="text-blue-600 hover:text-blue-700">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {personalInfo.map(({ label, value, secondary }) => (
          <div key={label}>
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-900">{value}</p>
            {secondary && (
              <p className="text-sm text-slate-300 mt-0.5">{secondary}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-5">
        <Folder className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Documents</h3>
      </div>
      <div className="flex flex-col gap-3">
        {documents.map(({ name, note, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {name}
              </p>
              <p className="text-xs text-slate-400">{note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main export                                                                */
/* -------------------------------------------------------------------------- */

export default function EmployeeProfilePage() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl w-full mx-auto">
        <PageActions />
        <ProfileHeaderCard />
        <StatCards />
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <WorkSummaryCard />
          <ActivityMapCard />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <PersonalInfoCard />
          <DocumentsCard />
        </div>
      </main>
    </div>
  );
}
