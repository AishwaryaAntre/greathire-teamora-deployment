import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { employeeProfileApi } from "@/lib/api/employeeProfile";

// Backend sends icon names as plain strings — resolve to a component client-side.
const ICON_BY_NAME = { Percent, Clock, CalendarCheck2, CalendarX2, LogIn, Award };
const DOC_ICON_BY_TYPE = { pdf: FileText, image: FileImage };

const intensityClasses = ["bg-slate-100", "bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-blue-800"];

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <h1 className="text-slate-900 font-semibold text-lg whitespace-nowrap">GreatHire WorkTrack</h1>

      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2.5 w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input type="text" placeholder="Search employees, reports..." className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full" />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700">
          <Settings className="w-5 h-5" />
        </button>
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white bg-slate-200" />
      </div>
    </header>
  );
}

function PageActions({ breadcrumb }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        {breadcrumb.map((crumb, i) => (
          <React.Fragment key={crumb}>
            {i > 0 && <span>›</span>}
            <span className={i === breadcrumb.length - 1 ? "text-slate-700 font-medium" : ""}>{crumb}</span>
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

function ProfileHeaderCard({ employee, onViewAttendance }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
        {employee.avatar ? <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" /> : employee.name?.[0]}
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">{employee.name}</h2>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-400" />
          {employee.role}
          <span className="text-slate-300">|</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono text-xs">ID: {employee.id}</span>
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
          <button onClick={onViewAttendance} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Eye className="w-3.5 h-3.5" />
            View Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCards({ statCards }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map(({ label, value, valueSuffix, icon, note, noteTone }) => {
        let Icon = ICON_BY_NAME[icon] || Percent;
        return (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <Icon className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {value}
              {valueSuffix && <span className="text-sm font-medium text-slate-400 ml-1">{valueSuffix}</span>}
            </div>
            <p className={`text-xs mt-1 ${noteTone === "up" ? "text-emerald-500 font-medium" : "text-slate-400"}`}>
              {noteTone === "up" && "↑ "}
              {note}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function WorkSummaryCard({ workSummary }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-5">
        <Briefcase className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Work Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {workSummary.map(({ label, value, live }) => (
          <div key={label} className={`rounded-xl p-4 relative ${live ? "bg-blue-50" : "bg-slate-50"}`}>
            <p className="text-[11px] font-medium text-slate-400 tracking-wide mb-2">{label}</p>
            <p className={`text-lg font-bold flex items-center gap-1.5 ${live ? "text-blue-600" : "text-slate-900"}`}>
              {live && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              {value}
            </p>
            {live && <Play className="w-6 h-6 text-blue-300 absolute top-3 right-3 fill-blue-100" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityMapCard({ activityMap }) {
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
          {activityMap.map((col, colIdx) => col.map((level, rowIdx) => <span key={`${colIdx}-${rowIdx}`} className={`w-4 h-4 rounded-sm ${intensityClasses[level]}`} />))}
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

function PersonalInfoCard({ personalInfo }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-bold text-slate-900">Personal Info</h3>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {personalInfo.map(({ label, value, secondary }) => (
          <div key={label}>
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-900">{value}</p>
            {secondary && <p className="text-sm text-slate-300 mt-0.5">{secondary}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsCard({ documents }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-5">
        <Folder className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Documents</h3>
      </div>
      <div className="flex flex-col gap-3">
        {documents.map(({ name, note, type }) => {
          let Icon = DOC_ICON_BY_TYPE[type] || FileText;
          return (
            <div key={name} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                <p className="text-xs text-slate-400">{note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(null);

  useEffect(() => {
    employeeProfileApi.getBundle(id).then(setBundle).catch((err) => console.error(err));
  }, [id]);

  if (!bundle) {
    return <div className="p-8 text-sm text-muted-foreground">Loading employee profile…</div>;
  }

  const { profile, statCards, workSummary, activityMap, personalInfo, documents } = bundle;

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl w-full mx-auto">
        <PageActions breadcrumb={profile.breadcrumb} />
        <ProfileHeaderCard employee={profile} onViewAttendance={() => navigate("/attendance")} />
        <StatCards statCards={statCards} />
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <WorkSummaryCard workSummary={workSummary} />
          <ActivityMapCard activityMap={activityMap} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <PersonalInfoCard personalInfo={personalInfo} />
          <DocumentsCard documents={documents} />
        </div>
      </main>
    </div>
  );
}
