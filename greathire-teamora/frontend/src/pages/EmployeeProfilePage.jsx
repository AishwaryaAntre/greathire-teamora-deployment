import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  Download,
  Pencil,
  Eye,
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
import { useAuth } from "@/lib/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageLoading from "@/components/routing/PageLoading";

// Backend sends icon names as plain strings — resolve to a component client-side.
const ICON_BY_NAME = { Percent, Clock, CalendarCheck2, CalendarX2, LogIn, Award };
const DOC_ICON_BY_TYPE = { pdf: FileText, image: FileImage };

const intensityClasses = ["bg-slate-100 dark:bg-slate-800", "bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-blue-800"];

function TopBar() {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      <h1
        onClick={() => navigate("/dashboard")}
        className="text-slate-900 dark:text-white font-semibold text-lg whitespace-nowrap cursor-pointer"
      >
        GreatHire WorkTrack
      </h1>

      <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2.5 w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
        <input type="text" placeholder="Search employees, reports..." className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 w-full" />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <button
          onClick={() => navigate("/notifications")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white bg-slate-200" />
      </div>
    </header>
  );
}

function PageActions({ breadcrumb }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-6">
      <nav className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
        {breadcrumb.map((crumb, i) => {
          const isLast = i === breadcrumb.length - 1;
          return (
            <React.Fragment key={crumb}>
              {i > 0 && <span>›</span>}
              {isLast ? (
                <span className="text-slate-700 dark:text-slate-200 font-medium">{crumb}</span>
              ) : (
                <button onClick={() => navigate("/employees")} className="hover:text-slate-600 dark:hover:text-slate-300">
                  {crumb}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
      >
        <Download className="w-4 h-4" />
        Export Report
      </button>
    </div>
  );
}

function EditEmployeeModal({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: employee.name || "",
    email: employee.email || "",
    phone: employee.phone || "",
    department: employee.department || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await employeeProfileApi.updatePersonalInfoFor(employee.id, form);
      onSaved();
    } catch (err) {
      setError(err.message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Edit Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="edit-name">Full name</Label>
            <Input id="edit-name" required value={form.name} onChange={set("name")} />
          </div>
          <div>
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" required value={form.email} onChange={set("email")} />
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <Label htmlFor="edit-department">Department</Label>
            <Input id="edit-department" value={form.department} onChange={set("department")} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function ProfileHeaderCard({ employee, onViewAttendance, canEdit, onEdit }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6 flex flex-col sm:flex-row sm:items-center gap-6">
      <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-400">
        {employee.avatar ? <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" /> : employee.name?.[0]}
        <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">{employee.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          {employee.role}
          <span className="text-slate-300">|</span>
          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono text-xs">ID: {employee.id}</span>
        </p>
      </div>

      <div className="flex flex-col sm:items-end gap-3">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {employee.status}
        </span>
        <div className="flex items-center gap-2">
          {canEdit ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Employee
            </button>
          ) : (
            <button
              disabled
              title="Only an admin can edit another employee's profile"
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 cursor-not-allowed opacity-60"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Employee
            </button>
          )}
          <button onClick={onViewAttendance} className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950">
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
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
              <Icon className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {value}
              {valueSuffix && <span className="text-sm font-medium text-slate-400 dark:text-slate-500 ml-1">{valueSuffix}</span>}
            </div>
            <p className={`text-xs mt-1 ${noteTone === "up" ? "text-emerald-500 font-medium" : "text-slate-400 dark:text-slate-500"}`}>
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-5">
        <Briefcase className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Work Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {workSummary.map(({ label, value, live }) => (
          <div key={label} className={`rounded-xl p-4 relative ${live ? "bg-blue-50" : "bg-slate-50 dark:bg-slate-950"}`}>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide mb-2">{label}</p>
            <p className={`text-lg font-bold flex items-center gap-1.5 ${live ? "text-blue-600" : "text-slate-900 dark:text-white"}`}>
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 w-full lg:w-72 flex-shrink-0">
      <div className="flex items-center gap-2 mb-5">
        <Calendar className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Map</h3>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col justify-between text-[10px] text-slate-400 dark:text-slate-500 py-0.5">
          <span>M</span>
          <span>W</span>
          <span>F</span>
        </div>
        <div className="grid grid-flow-col grid-rows-5 gap-1">
          {activityMap.map((col, colIdx) => col.map((level, rowIdx) => <span key={`${colIdx}-${rowIdx}`} className={`w-4 h-4 rounded-sm ${intensityClasses[level]}`} />))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-[11px] text-slate-400 dark:text-slate-500">
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex-1 min-w-0">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Info</h3>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {personalInfo.map(({ label, value, secondary }) => (
          <div key={label}>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">{value}</p>
            {secondary && <p className="text-sm text-slate-300 mt-0.5">{secondary}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsCard({ documents }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-5">
        <Folder className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Documents</h3>
      </div>
      <div className="flex flex-col gap-3">
        {documents.map(({ name, note, type }) => {
          let Icon = DOC_ICON_BY_TYPE[type] || FileText;
          return (
            <div key={name} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{note}</p>
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
  const { user } = useAuth();
  const [bundle, setBundle] = useState(null);
  const [editing, setEditing] = useState(false);
  const isAdmin = user?.role === "admin";

  function loadBundle() {
    employeeProfileApi.getBundle(id).then(setBundle).catch((err) => console.error(err));
  }

  useEffect(() => {
    loadBundle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!bundle) {
    return <PageLoading label="Loading employee profile…" />;
  }

  const { profile, statCards, workSummary, activityMap, personalInfo, documents } = bundle;

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950">
      <TopBar />
      <main className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl w-full mx-auto">
        <PageActions breadcrumb={profile.breadcrumb} />
        <ProfileHeaderCard
          employee={profile}
          onViewAttendance={() => navigate("/attendance")}
          canEdit={isAdmin}
          onEdit={() => setEditing(true)}
        />
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

      {editing && (
        <EditEmployeeModal
          employee={{ id: profile.id, name: profile.name, email: personalInfo.find((p) => p.label === "Contact")?.value, phone: personalInfo.find((p) => p.label === "Contact")?.secondary, department: profile.department }}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            loadBundle();
          }}
        />
      )}
    </div>
  );
}
