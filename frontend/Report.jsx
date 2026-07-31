

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  TrendingUp,
  FileBarChart2,
  Settings,
  HelpCircle,
  Search,
  Bell,
  ChevronDown,
  Calendar,
  Zap,
  LayoutGrid,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";
 
/* -------------------------------------------------------------------------- */
/* Static data                                                                */
/* -------------------------------------------------------------------------- */
 
let navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Directory", icon: Users },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Performance", icon: TrendingUp },
  { label: "Reports", icon: FileBarChart2, active: true },
];
 
let statsData = [
  {
    label: "TOTAL EMPLOYEES",
    value: "1,111",
    change: "+11.1%",
    changeLabel: "vs last mo",
    icon: Users,
  },
  {
    label: "AVG ATTENDANCE",
    value: "99%",
    change: "+9.9%",
    changeLabel: "vs last mo",
    icon: FileBarChart2,
  },
];
 
let timeRanges = ["12 Months", "30 Days", "7 Days"];
 
/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */
 
function Sidebar() {
  return (
    <>
      <aside
        className="static inset-y-0 left-0 z-50 w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0"
      >
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-6">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-semibold text-sm">GreatHire</p>
              <p className="text-slate-400 text-xs">Teamora</p>
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
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
 
        <div className="px-3 pb-6">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-lg mb-4">
            <span className="text-lg leading-none">+</span> New Report
          </button>
 
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-left">
              <Settings className="w-4 h-4 flex-shrink-0" />
              Settings
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors text-left">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
 
/* -------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* -------------------------------------------------------------------------- */
 
function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3 min-w-0">
        <h1 className="text-slate-900 font-semibold text-base sm:text-lg truncate">
          GreatHire WorkTrack
        </h1>
      </div>
 
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-56 lg:w-72">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
          />
        </div>
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700 hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden flex-shrink-0">
          <img
            src="https://i.pravatar.cc/64?img=47"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
 
/* -------------------------------------------------------------------------- */
/* PageHeader                                                                 */
/* -------------------------------------------------------------------------- */
 
function PageHeader({ activeRange, setActiveRange }) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Reports &amp; Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Analyze workforce attendance, productivity and performance insights.
        </p>
      </div>
 
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeRange === range
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
 
        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <FileBarChart2 className="w-4 h-4" />
          All Departments
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
 
        <button className="flex items-center justify-center bg-white border border-slate-200 rounded-lg p-2 text-slate-600 hover:bg-slate-50">
          <Calendar className="w-4 h-4" />
        </button>
 
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg px-4 py-2 text-sm font-medium">
          <Zap className="w-4 h-4" />
          Generate
        </button>
 
        <button className="flex items-center justify-center bg-white border border-slate-200 rounded-lg p-2 text-slate-600 hover:bg-slate-50">
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
 
/* -------------------------------------------------------------------------- */
/* StatsCards                                                                 */
/* -------------------------------------------------------------------------- */
 
function StatsCard({ label, value, change, changeLabel, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex-1 min-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 tracking-wide">
          {label}
        </span>
        <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-slate-900">{value}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
          <ArrowUpRight className="w-3 h-3" />
          {change}
          <span className="text-slate-400 font-normal ml-1">{changeLabel}</span>
        </span>
      </div>
    </div>
  );
}
 
function StatsCards() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {statsData.map((stat) => (
        <StatsCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
 
/* -------------------------------------------------------------------------- */
/* Charts                                                                     */
/* -------------------------------------------------------------------------- */
 
function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Attendance Trends */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Attendance Trends
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">12 month overview</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        <div
          className="mt-4 rounded-lg border border-dashed border-slate-200 flex items-center justify-center"
          style={{ height: "260px" }}
        >
          <p className="text-sm text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-300" />
            Multi-series Line Chart (Present, Absent, Leave, Late)
          </p>
        </div>
      </div>
 
      {/* Avg Working Hours */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Avg Working Hours
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Daily average</p>
          </div>
          <span className="text-blue-600 font-bold text-base">8.2h</span>
        </div>
        <div
          className="mt-4 rounded-lg flex items-end justify-center flex-1 overflow-hidden"
          style={{
            height: "260px",
          
          }}
        >
          <p className="text-sm text-slate-500 flex items-center gap-2 pb-4">
            <LayoutGrid className="w-4 h-4 text-slate-400" />
            Area Chart Visualization
          </p>
        </div>
      </div>
    </div>
  );
}
 
/* -------------------------------------------------------------------------- */
/* ReportsTable (placeholder to preserve structure / functionality hooks)     */
/* -------------------------------------------------------------------------- */
 
function ReportsTable() {
  return null;
}
 
/* -------------------------------------------------------------------------- */
/* ActivityPanel (placeholder to preserve structure / functionality hooks)    */
/* -------------------------------------------------------------------------- */
 
function ActivityPanel() {
  return null;
}
 
/* -------------------------------------------------------------------------- */
/* Main export                                                                */
/* -------------------------------------------------------------------------- */
 
export default function Report() {
  let [activeRange, setActiveRange] = useState("12 Months");
 
  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar />
 
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />
 
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <PageHeader activeRange={activeRange} setActiveRange={setActiveRange} />
          <StatsCards />
          <Charts />
          <ReportsTable />
          <ActivityPanel />
        </main>
      </div>
    </div>
  );
}
 