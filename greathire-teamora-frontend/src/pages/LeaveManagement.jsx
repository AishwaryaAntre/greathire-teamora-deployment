import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { leaveApi } from "@/lib/api/leave";
import { reportsApi } from "@/lib/api/reports";
import { useAuth } from "@/lib/AuthContext";

const defaultNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Directory", icon: Users, to: "/profile" },
  { label: "Attendance", icon: CalendarCheck, to: "/attendance" },
  { label: "Leave Management", icon: CalendarClock, active: true, to: "/leave" },
];

// Backend sends stat cards keyed by `key` — map to an icon client-side.
const STAT_ICON_BY_KEY = {
  pending: ClipboardCheck,
  approvedToday: CheckCircle2,
  onLeaveToday: Waypoints,
};

const defaultBrand = { name: "Teamora HR", tagline: "Leave Management System" };

function formatDateShort(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

// Sidebar

function Sidebar({ brand, navItems }) {
  const navigate = useNavigate();
  return (
    <aside className="static inset-y-0 left-0 z-50 w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">{brand.name}</p>
            <p className="text-slate-400 text-xs">{brand.tagline}</p>
          </div>
        </div>

        <nav className="mt-2 px-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${active ? "bg-slate-800 text-white border-l-2 border-blue-500" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"}`}
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

function TopBar({ user, search, onSearchChange }) {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
          <div className="w-9 h-9 rounded-full bg-slate-300 overflow-hidden flex-shrink-0" />
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

function PageHeader({ activeTab, onTabChange, onExport }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Leave Management</h2>
        <p className="text-sm text-slate-500 mt-1">Review, approve and manage employee leave requests.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          {["This Month", "Last Month"].map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab === "This Month" && <CalendarClock className="w-3.5 h-3.5" />}
              {tab}
            </button>
          ))}
        </div>

        <button onClick={onExport} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2 text-sm font-medium">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}

function StatsCard({ icon: Icon, tag, label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 min-w-[180px]">
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{tag}</span>
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
        <StatsCard key={stat.label} {...stat} icon={STAT_ICON_BY_KEY[stat.key] || ClipboardCheck} />
      ))}
    </div>
  );
}

function QuickActions({ actions }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 h-full">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {actions.map(({ label, icon: Icon, onClick, disabled }) => (
          <button
            key={label}
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {label}
            <Icon className="w-4 h-4 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

function LeaveTypeBadge({ type }) {
  return <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{type}</span>;
}

function StatusBadge({ tone, children }) {
  const toneStyles = { pending: "bg-amber-50 text-amber-600", approved: "bg-emerald-50 text-emerald-600", rejected: "bg-red-50 text-red-600" };
  const dotStyles = { pending: "bg-amber-500", approved: "bg-emerald-500", rejected: "bg-red-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${toneStyles[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[tone]}`}></span>
      {children}
    </span>
  );
}

function LeaveRequestRow({ row, onApprove, onReject }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {row.initials}
          </div>
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
        {row.status === "Pending" ? (
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => onApprove(row.id)} className="text-xs font-medium text-emerald-600 hover:underline">
              Approve
            </button>
            <button onClick={() => onReject(row.id)} className="text-xs font-medium text-red-500 hover:underline">
              Reject
            </button>
          </div>
        ) : (
          <button className="text-slate-400 hover:text-slate-600">
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

function LeaveRequestsTable({ requests, onApprove, onReject }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Leave Requests</h3>
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
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-slate-400">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              requests.map((row) => <LeaveRequestRow key={row.id} row={row} onApprove={onApprove} onReject={onReject} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActivityPanel({ availability }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Team Availability (Today)</h3>
      <div className="flex flex-col gap-3">
        {availability.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`w-2 h-2 rounded-full ${item.dotColor}`}></span>
              {item.label}
            </span>
            <span className="text-sm font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function initialsFor(name = "") {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export default function LeaveManagement({ brand = defaultBrand, navItems = defaultNavItems }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("This Month");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState([]);
  const [teamAvailability, setTeamAvailability] = useState([]);
  const [requests, setRequests] = useState([]);
  const [approvingAll, setApprovingAll] = useState(false);

  const refresh = useCallback(async () => {
    let [statsData, availabilityData, requestsData] = await Promise.all([
      leaveApi.getStats(),
      leaveApi.getTeamAvailability(),
      leaveApi.list({ period: activeTab, search }),
    ]);
    setStats(statsData);
    setTeamAvailability(availabilityData);
    setRequests(
      requestsData.map((r) => ({
        id: r.id,
        name: r.employee?.name,
        role: r.employee?.role,
        initials: initialsFor(r.employee?.name),
        leaveType: r.leaveType,
        dates: `${formatDateShort(r.startDate)} - ${formatDateShort(r.endDate)}`,
        duration: `${r.durationDays} Day${r.durationDays === 1 ? "" : "s"}`,
        status: r.status,
        statusTone: r.status.toLowerCase(),
      }))
    );
  }, [activeTab, search]);

  useEffect(() => {
    refresh().catch((err) => console.error(err));
  }, [refresh]);

  async function handleApprove(id) {
    await leaveApi.approve(id);
    await refresh();
  }
  async function handleReject(id) {
    await leaveApi.reject(id);
    await refresh();
  }
  async function handleApproveAll() {
    setApprovingAll(true);
    try {
      await leaveApi.approveAll();
      await refresh();
    } finally {
      setApprovingAll(false);
    }
  }
  async function handleGenerateReport() {
    await reportsApi.generate({ range: "12m", department: "All Departments", title: "Leave Report" });
    navigate("/reports");
  }
  function handleExport() {
    window.open(leaveApi.exportCsvUrl({ period: activeTab, search }), "_blank");
  }

  const quickActions = [
    { label: approvingAll ? "Approving..." : "Approve All Pending", icon: ArrowRight, onClick: handleApproveAll, disabled: approvingAll },
    { label: "Generate Leave Report", icon: BarChart3, onClick: handleGenerateReport },
  ];

  const topBarUser = { name: user?.name || "—", role: user?.role || "Employee" };

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar brand={brand} navItems={navItems} />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar user={topBarUser} search={search} onSearchChange={setSearch} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <PageHeader activeTab={activeTab} onTabChange={setActiveTab} onExport={handleExport} />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
            <div className="lg:col-span-3">
              <StatsCards data={stats} />
            </div>
            <QuickActions actions={quickActions} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
            <div className="lg:col-span-3">
              <LeaveRequestsTable requests={requests} onApprove={handleApprove} onReject={handleReject} />
            </div>
            <ActivityPanel availability={teamAvailability} />
          </div>
        </main>
      </div>
    </div>
  );
}
