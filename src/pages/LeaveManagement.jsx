import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarClock,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Download,
  ClipboardCheck,
  CheckCircle2,
  Waypoints,
  ArrowRight,
  BarChart3,
  Filter,
  MoreVertical,
} from "lucide-react";


// Default data (used as fallback props — pass your own data to override) 

const defaultNavItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Directory", icon: Users },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Leave Management", icon: CalendarClock, active: true },
];

const defaultStatsData = [
  {
    icon: ClipboardCheck,
    tag: "Pending",
    label: "Pending Requests",
    value: "14",
  },
  {
    icon: CheckCircle2,
    tag: "Today",
    label: "Approved Today",
    value: "8",
  },
  {
    icon: Waypoints,
    tag: "Active",
    label: "On Leave Today",
    value: "5",
  },
];

const defaultQuickActions = [
  { label: "Approve All Pending", icon: ArrowRight },
  { label: "Generate Leave Report", icon: BarChart3 },
];

const defaultLeaveRequests = [
  {
    name: "Marcus Vance",
    role: "Senior Developer",
    avatar: "img",
    leaveType: "Annual",
    dates: "Oct 12 - Oct 16",
    duration: "5 Days",
    status: "Pending",
    statusTone: "pending",
  },
  {
    name: "Elena Rostova",
    role: "Product Manager",
    avatar: "img",
    leaveType: "Sick Leave",
    dates: "Oct 05 - Oct 06",
    duration: "2 Days",
    status: "Approved",
    statusTone: "approved",
  },
];

const defaultTeamAvailability = [
  { label: "Working", value: "142", dotColor: "bg-emerald-500" },
  { label: "On Leave", value: "5", dotColor: "bg-amber-500" },
  { label: "Sick Leave", value: "2", dotColor: "bg-red-500" },
];

const defaultUser = {
  name: "Sarah Jenkins",
  role: "HR Director",
  avatar: "img",
};

const defaultBrand = {
  name: "Teamora HR",
  tagline: "Leave Management System",
};

// Sidebar 

function Sidebar({ brand, navItems }) {
  return (
    <aside className="static inset-y-0 left-0 z-50 w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">{brand.name}</p>
            <p className="text-slate-400 text-xs">{brand.tagline}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-2 px-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${
                  active
                    ? "bg-slate-800 text-white border-l-2 border-blue-500"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-6 border-t border-slate-800 pt-3 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-left">
          <Settings className="w-4 h-4 flex-shrink-0" />
          Settings
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-left">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          Support
        </button>
      </div>
    </aside>
  );
}
//TopBar 
function TopBar({ user }) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search requests..."
            className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full min-w-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700 hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-300 overflow-hidden flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              {user.name}
            </p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

//PageHeader 

function PageHeader() {
  const [activeTab, setActiveTab] = useState("This Month");

  return (
    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Leave Management</h2>
        <p className="text-sm text-slate-500 mt-1">
          Review, approve and manage employee leave requests.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          {["This Month", "Last Month"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "This Month" && <CalendarClock className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2 text-sm font-medium">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}

//StatsCards 

function StatsCard({ icon: Icon, tag, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 min-w-[180px]">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          {tag}
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatsCards({ data }) {
  return (
    <div className="flex flex-wrap gap-4">
      {data.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

//Quick Actions  

function QuickActions({ actions }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 h-full">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Quick Actions
      </h3>
      <div className="flex flex-col gap-3">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {label}
            <Icon className="w-4 h-4 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

//Leave Requests table 

function LeaveTypeBadge({ type }) {
  return (
    <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
      {type}
    </span>
  );
}

function StatusBadge({ tone, children }) {
  const toneStyles = {
    pending: "bg-amber-50 text-amber-600",
    approved: "bg-emerald-50 text-emerald-600",
  };
  const dotStyles = {
    pending: "bg-amber-500",
    approved: "bg-emerald-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${toneStyles[tone]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[tone]}`}></span>
      {children}
    </span>
  );
}

function LeaveRequestRow({ row }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p className="text-sm font-medium text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-400">{row.role}</p>
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <LeaveTypeBadge type={row.leaveType} />
      </td>
      <td className="py-4 pr-4 text-sm text-slate-600 whitespace-nowrap">
        <p>{row.dates}</p>
        <p className="text-xs text-slate-400">{row.duration}</p>
      </td>
      <td className="py-4 pr-4">
        <StatusBadge tone={row.statusTone}>{row.status}</StatusBadge>
      </td>
      <td className="py-4 text-right">
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

function LeaveRequestsTable({ requests }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">
          Leave Requests
        </h3>
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
              <th className="pb-2 font-medium">Employee</th>
              <th className="pb-2 font-medium">Leave Type</th>
              <th className="pb-2 font-medium">Dates</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((row) => (
              <LeaveRequestRow key={row.name} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//Team Availability panel

function ActivityPanel({ availability }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-900 mb-4">
        Team Availability (Today)
      </h3>
      <div className="flex flex-col gap-3">
        {availability.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`}></span>
              {item.label}
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


// Main content grid  

function Charts({ statsData, quickActions }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
      <div className="lg:col-span-3">
        <StatsCards data={statsData} />
      </div>
      <QuickActions actions={quickActions} />
    </div>
  );
}

function ReportsTable({ leaveRequests, teamAvailability }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
      <div className="lg:col-span-3">
        <LeaveRequestsTable requests={leaveRequests} />
      </div>
      <ActivityPanel availability={teamAvailability} />
    </div>
  );
}


//Main export 

export default function LeaveManagement({
  brand = defaultBrand,
  user = defaultUser,
  navItems = defaultNavItems,
  statsData = defaultStatsData,
  quickActions = defaultQuickActions,
  leaveRequests = defaultLeaveRequests,
  teamAvailability = defaultTeamAvailability,
}) {
  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar brand={brand} navItems={navItems} />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar user={user} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <PageHeader />
          <Charts statsData={statsData} quickActions={quickActions} />
          <ReportsTable
            leaveRequests={leaveRequests}
            teamAvailability={teamAvailability}
          />
        </main>
      </div>
    </div>
  );
}
