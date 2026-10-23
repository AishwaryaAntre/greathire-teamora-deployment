import React, { useCallback, useEffect, useState } from "react";
import { notificationsApi } from "@/lib/api/notifications";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileBarChart2,
  Menu,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { reportsApi } from "@/lib/api/reports";
import MasterSidebar from "@/components/layout/MasterSidebar";
import ProfileAvatarButton from "@/components/layout/ProfileAvatarButton";

const RANGE_TO_API = { "12 Months": "12m", "30 Days": "30d", "7 Days": "7d" };
const STAT_ICON_BY_LABEL = { "TOTAL EMPLOYEES": Users, "AVG ATTENDANCE": FileBarChart2 };
const PROJECT_STATUS_COLORS = {
  Active: "#2563eb",
  Working: "#f59e0b",
  Completed: "#10b981",
  "On Hold": "#94a3b8",
  Cancelled: "#ef4444",
};


function TopBar() {
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkNotifications() {
      try {
        const response = await notificationsApi.list({
          filter: "all",
          search: "",
        });

        if (!active) return;

        const items = Array.isArray(response)
          ? response
          : response?.data?.notifications ??
            response?.notifications ??
            response?.data ??
            [];

        if (Array.isArray(items)) {
          setHasUnreadNotifications(
            items.some(
              (item) =>
                item.unread === true ||
                item.isRead === false ||
                item.read === false
            )
          );
        }
      } catch (error) {
        console.error("Failed to check notifications:", error);
      }
    }

    checkNotifications();

    const intervalId = setInterval(checkNotifications, 5000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  function openSidebar() {
    window.dispatchEvent(new CustomEvent("teamora:open-sidebar"));
  }

  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={openSidebar}
          aria-label="Open navigation"
          className="lg:hidden shrink-0 rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Menu className="h-4 w-4" />
        </button>
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-slate-900 dark:text-white font-semibold text-base sm:text-lg truncate cursor-pointer"
        >
          GreatHire WorkTrack
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search reports..."
            className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 w-full"
          />
        </div>

        <button
          onClick={() => navigate("/notifications")}
          className="relative text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />

          {hasUnreadNotifications && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        <button
          onClick={() => navigate("/support")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hidden sm:block"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        <ProfileAvatarButton />
      </div>
    </header>
  );
}


function PageHeader({ activeRange, setActiveRange, department, onDepartmentChange, departments, onGenerate, generating }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reports &amp; Analytics</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analyze workforce attendance, productivity and performance insights.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {Object.keys(RANGE_TO_API).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeRange === range ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <FileBarChart2 className="w-4 h-4" />
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="bg-transparent outline-none dark:[color-scheme:dark]"
          >
            <option className="bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200">
              All Departments
            </option>
            {departments.map((d) => (
              <option
                key={d}
                className="bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {d}
              </option>
            ))}
          </select>
        
        </label>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          <Zap className="w-4 h-4" />
          {generating ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}

function StatsCard({ label, value, change, changeLabel, icon: Icon }) {
  const isUp = String(change).startsWith("+") || !String(change).startsWith("-");
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex-1 min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">{label}</span>
        <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className={`flex items-center gap-1 text-xs font-medium ${isUp ? "text-emerald-500" : "text-red-500"}`}>
          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
          <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">{changeLabel}</span>
        </span>
      </div>
    </div>
  );
}

function StatsCards({ stats }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {stats.map((stat) => (
        <StatsCard key={stat.label} {...stat} icon={STAT_ICON_BY_LABEL[stat.label] || FileBarChart2} />
      ))}
    </div>
  );
}

function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Charts({ attendanceTrends, workingHours }) {
  const trendData = attendanceTrends.map((d) => ({ ...d, label: formatShortDate(d.date) }));
  const hoursData = (workingHours.series || []).map((d) => ({ ...d, label: formatShortDate(d.date) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Attendance Trends</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Present, Late, Absent by day</p>
          </div>
        </div>
        <div style={{ height: 260 }} className="mt-4">
          {trendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">No attendance data for this range.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="present" stroke="#2563eb" strokeWidth={2} dot={false} name="Present" />
                <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} dot={false} name="Late" />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={false} name="Absent" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Avg Working Hours</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Daily average</p>
          </div>
          <span className="text-blue-600 font-bold text-base">{workingHours.overallAvg || 0}h</span>
        </div>
        <div style={{ height: 260 }} className="mt-4 flex-1">
          {hoursData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">No data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="avgHours" stroke="#2563eb" fill="#bfdbfe" name="Avg Hours" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCompletionChart({ completionStats }) {
  const byStatus = (completionStats.byStatus || []).filter((s) => s.value > 0);
  const total = completionStats.total || 0;
  const completedPct = total ? Math.round((completionStats.completed / total) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 mt-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Projects: Completed vs Not Completed</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Breakdown by project status, all projects</p>
        </div>
        <span className="text-blue-600 font-bold text-base">{completedPct}% completed</span>
      </div>
      <div style={{ height: 260 }} className="mt-4">
        {total === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">No projects yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="status" innerRadius={60} outerRadius={95} paddingAngle={2}>
                {byStatus.map((entry) => (
                  <Cell key={entry.status} fill={PROJECT_STATUS_COLORS[entry.status] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function Report() {
  const [activeRange, setActiveRange] = useState("12 Months");
  const [department, setDepartment] = useState("All Departments");
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [workingHours, setWorkingHours] = useState({ series: [], overallAvg: 0 });
  const [completionStats, setCompletionStats] = useState({ total: 0, completed: 0, notCompleted: 0, byStatus: [] });
  const [generating, setGenerating] = useState(false);

  const refresh = useCallback(async () => {
    let range = RANGE_TO_API[activeRange];
    let params = { range, department: department === "All Departments" ? undefined : department };
    let [statsData, trendsData, hoursData, completionData] = await Promise.all([
      reportsApi.getStats(params),
      reportsApi.getAttendanceTrends(params),
      reportsApi.getWorkingHours(params),
      reportsApi.getProjectCompletion(),
    ]);
    setStats(statsData);
    setAttendanceTrends(trendsData);
    setWorkingHours(hoursData);
    setCompletionStats(completionData);
  }, [activeRange, department]);

  useEffect(() => {
    reportsApi.listDepartments().then(setDepartments).catch(() => {});
  }, []);

  useEffect(() => {
    refresh().catch((err) => console.error(err));
  }, [refresh]);

async function handleGenerate() {
  setGenerating(true);

  try {
    const params = {
      range: RANGE_TO_API[activeRange],
      department:
        department === "All Departments" ? undefined : department,
    };

    await reportsApi.generate(params);

    const response = await reportsApi.exportPdf(params);

    if (!response.ok) {
      throw new Error("Failed to download PDF report.");
    }

    const pdfBlob = await response.blob();
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `greathire-report-${params.range}.pdf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

    await refresh();
  } catch (error) {
    console.error("Failed to generate report:", error);
    window.alert(error.message || "Failed to generate report.");
  } finally {
    setGenerating(false);
  }
}

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50 dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <PageHeader
            activeRange={activeRange}
            setActiveRange={setActiveRange}
            department={department}
            onDepartmentChange={setDepartment}
            departments={departments}
            onGenerate={handleGenerate}
            generating={generating}
          />
          <StatsCards stats={stats} />
          <Charts attendanceTrends={attendanceTrends} workingHours={workingHours} />
          <ProjectCompletionChart completionStats={completionStats} />
        </main>
      </div>
    </div>
  );
}
