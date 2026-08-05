import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileBarChart2,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { reportsApi } from "@/lib/api/reports";
import MasterSidebar from "@/components/layout/MasterSidebar";

const RANGE_TO_API = { "12 Months": "12m", "30 Days": "30d", "7 Days": "7d" };
const STAT_ICON_BY_LABEL = { "TOTAL EMPLOYEES": Users, "AVG ATTENDANCE": FileBarChart2 };

function TopBar() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 min-w-0">
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
          <input type="text" placeholder="Search reports..." className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 w-full" />
        </div>
        <button
          onClick={() => navigate("/notifications")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/support")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hidden sm:block"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden flex-shrink-0" />
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
          <select value={department} onChange={(e) => onDepartmentChange(e.target.value)} className="outline-none bg-transparent">
            <option>All Departments</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
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

export default function Report() {
  const [activeRange, setActiveRange] = useState("12 Months");
  const [department, setDepartment] = useState("All Departments");
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState([]);
  const [attendanceTrends, setAttendanceTrends] = useState([]);
  const [workingHours, setWorkingHours] = useState({ series: [], overallAvg: 0 });
  const [generating, setGenerating] = useState(false);

  const refresh = useCallback(async () => {
    let range = RANGE_TO_API[activeRange];
    let params = { range, department: department === "All Departments" ? undefined : department };
    let [statsData, trendsData, hoursData] = await Promise.all([
      reportsApi.getStats(params),
      reportsApi.getAttendanceTrends(params),
      reportsApi.getWorkingHours(params),
    ]);
    setStats(statsData);
    setAttendanceTrends(trendsData);
    setWorkingHours(hoursData);
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
      await reportsApi.generate({ range: RANGE_TO_API[activeRange], department });
      await refresh();
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
        </main>
      </div>
    </div>
  );
}
