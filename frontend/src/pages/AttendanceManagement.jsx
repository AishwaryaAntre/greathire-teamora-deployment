import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Calendar,
  Building2,
  SlidersHorizontal,
  ChevronDown,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  LogIn,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { attendanceApi } from "@/lib/api/attendance";
import { useAuth } from "@/lib/AuthContext";
import MasterSidebar from "@/components/layout/MasterSidebar";

// Backend sends stat cards without icons attached — map by label client-side.
let STAT_ICONS = { "Total Expected": Users };

// Backend sends the "Today's Summary" rows keyed by `key` — map to icon + colors client-side.
let SUMMARY_ICON_CONFIG = {
  onTime: { icon: LogIn, iconBg: "bg-emerald-100", iconColor: "text-emerald-600" },
  late: { icon: Clock, iconBg: "bg-amber-100", iconColor: "text-amber-600" },
};

function TopBar({ onCheckIn, checkingIn, search, onSearchChange }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 w-full min-w-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <button
          onClick={() => navigate("/notifications")}
          className="relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>
        <button
          onClick={() => navigate("/support")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hidden sm:block"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hidden sm:block"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden flex-shrink-0" />
      </div>
    </header>
  );
}

function PageHeader({ onExport, onExportCsv, onRefresh, showExport }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Management</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor employee attendance, working hours and live activity.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showExport && (
          <>
            <button onClick={onExport} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button onClick={onExportCsv} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950">
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </button>
          </>
        )}
        <button onClick={onRefresh} className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100">
          <RefreshCw className="w-4 h-4" />
          Refresh Live
        </button>
      </div>
    </div>
  );
}

function Filters({ date, onDateChange, department, onDepartmentChange, departments, status, onStatusChange }) {
  let statuses = ["All", "Present", "Late", "Absent", "Weekend"];
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <label className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} className="outline-none bg-transparent" />
      </label>

      <label className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <select value={department} onChange={(e) => onDepartmentChange(e.target.value)} className="outline-none bg-transparent">
          <option>All Departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
      </label>

      <label className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <select value={status} onChange={(e) => onStatusChange(e.target.value)} className="outline-none bg-transparent">
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
      </label>
    </div>
  );
}

function StatsCard({ label, dotColor, value, subLabel, badge, badgeTone }) {
  let Icon = STAT_ICONS[label];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex-1 min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
          {label}
        </span>
        {Icon && (
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        {badge && (
          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${badgeTone === "positive" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
            {badgeTone === "positive" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subLabel}</p>
    </div>
  );
}

function StatsCards({ stats }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {stats.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

function StatusBadge({ tone, children }) {
  let toneStyles = { working: "bg-emerald-50 text-emerald-600", break: "bg-amber-50 text-amber-600" };
  let dotStyles = { working: "bg-emerald-500", break: "bg-amber-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${toneStyles[tone]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[tone]}`}></span>
      {children}
    </span>
  );
}

function LiveAttendanceRow({ row }) {
  const navigate = useNavigate();
  return (
    <tr className="border-t border-slate-100 dark:border-slate-800">
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center flex-shrink-0">
              {row.initials}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{row.name}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{row.role}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
        {row.checkIn} {row.late && <span className="text-amber-500 text-xs font-medium">(Late)</span>}
      </td>
      <td className="py-3 pr-4">
        <StatusBadge tone={row.statusTone}>{row.status}</StatusBadge>
      </td>
      <td className="py-3 pr-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">{row.hours}</td>
      <td className="py-3 text-right">
        <button
          onClick={() => navigate("/employees")}
          aria-label="View employee"
          className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

function LiveAttendanceTable({ rows }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Live Attendance</h3>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="text-left text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              <th className="pb-2 font-medium">Employee</th>
              <th className="pb-2 font-medium">Check In</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Hours</th>
              <th className="pb-2 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">
                  No one is checked in right now.
                </td>
              </tr>
            ) : (
              rows.map((row) => <LiveAttendanceRow key={row.id} row={row} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, key: itemKey }) {
  let config = SUMMARY_ICON_CONFIG[itemKey] || SUMMARY_ICON_CONFIG.onTime;
  let Icon = config.icon;
  return (
    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.iconBg}`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      </div>
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

function ActivityPanel({ summary }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Today's Summary</h3>
      <div className="flex flex-col gap-3">
        {summary.map((item) => (
          <SummaryItem key={item.key} {...item} itemKey={item.key} />
        ))}
      </div>
    </div>
  );
}

export default function AttendanceManagement() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState([]);
  const [live, setLive] = useState([]);
  const [summary, setSummary] = useState([]);
  const [checkingIn, setCheckingIn] = useState(false);

  const refresh = useCallback(async () => {
    let [statsData, liveData, summaryData] = await Promise.all([
      attendanceApi.getStats(date),
      attendanceApi.getLive({ date, department, status, search }),
      attendanceApi.getSummary(date),
    ]);
    setStats(statsData);
    setLive(liveData);
    setSummary(summaryData);
  }, [date, department, status, search]);

  useEffect(() => {
    attendanceApi.listDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    refresh().catch((err) => console.error(err));
  }, [refresh]);

  async function handleCheckIn() {
    if (!user?.employeeId) return;
    setCheckingIn(true);
    try {
      await attendanceApi.checkIn(user.employeeId);
      await refresh();
    } finally {
      setCheckingIn(false);
    }
  }

  function handleExport() {
    window.open(attendanceApi.exportCsvUrl({ date, department, status }), "_blank");
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-background dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar onCheckIn={handleCheckIn} checkingIn={checkingIn} search={search} onSearchChange={setSearch} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <PageHeader onExport={handleExport} onExportCsv={handleExport} onRefresh={refresh} showExport={user?.role === "admin"} />
          <Filters
            date={date}
            onDateChange={setDate}
            department={department}
            onDepartmentChange={setDepartment}
            departments={departments}
            status={status}
            onStatusChange={setStatus}
          />
          <StatsCards stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LiveAttendanceTable rows={live} />
            </div>
            <ActivityPanel summary={summary} />
          </div>
        </main>
      </div>
    </div>
  );
}
