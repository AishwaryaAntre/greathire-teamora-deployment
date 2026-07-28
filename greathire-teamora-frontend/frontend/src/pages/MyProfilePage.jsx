import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  LayoutDashboard,
  CalendarCheck,
  CalendarClock,
  Users,
  FileBarChart2,
  Settings,
  HelpCircle,
  Search,
  Bell,
  MessageSquare,
  Grid3x3,
  Pencil,
  Mail,
  Phone,
  Calendar,
  User,
  ChevronRight,
  ShieldCheck,
  Gauge,
  FileText,
  Download,
  Clock3,
} from "lucide-react";
import { employeeProfileApi } from "@/lib/api/employeeProfile";
import { attendanceApi } from "@/lib/api/attendance";
import { useAuth } from "@/lib/AuthContext";

let navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Attendance", icon: CalendarCheck, to: "/attendance" },
  { label: "Schedules", icon: CalendarClock, to: "/leave" },
  { label: "Employees", icon: Users, active: true, to: "/profile" },
  { label: "Reports", icon: FileBarChart2, to: "/reports" },
];

// Backend sends stat labels like "Percent"/"Clock" as plain strings — map to icons client-side.
let ICON_BY_NAME = { Percent: Gauge, Clock: Clock3, CalendarCheck2: CalendarCheck, CalendarX2: FileBarChart2 };

function Sidebar() {
  let navigate = useNavigate();
  let { user } = useAuth();

  async function handleClockIn() {
    if (!user?.employeeId) return;
    await attendanceApi.checkIn(user.employeeId);
  }

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">GreatHire</p>
            <p className="text-slate-400 text-xs">WorkTrack Pro</p>
          </div>
        </div>

        <div className="px-4 mb-4">
          <button onClick={handleClockIn} className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-lg">
            Clock In
          </button>
        </div>

        <nav className="px-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-6 flex flex-col gap-1">
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

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full" />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
        <Link to="/messages">
          <button className="text-slate-500 hover:text-slate-700">
            <MessageSquare className="w-5 h-5" />
          </button>
        </Link>
        <button className="text-slate-500 hover:text-slate-700">
          <Grid3x3 className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-200" />
      </div>
    </header>
  );
}

function ProfileHeader({ profile, contact, onEdit }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
            {profile.avatar ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" /> : profile.name?.[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {profile.role} • ID: {profile.id}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
              {contact?.value && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {contact.value}
                </span>
              )}
              {contact?.secondary && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {contact.secondary}
                </span>
              )}
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {profile.status || "Active"}
            </span>
          </div>
        </div>

        <button onClick={onEdit} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}

function EditProfileForm({ initial, onCancel, onSave, saving }) {
  let [name, setName] = useState(initial.name || "");
  let [email, setEmail] = useState(initial.email || "");
  let [phone, setPhone] = useState(initial.phone || "");

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Edit Profile</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => onSave({ name, email, phone })}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button onClick={onCancel} className="text-sm font-medium text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50">
          Cancel
        </button>
      </div>
    </div>
  );
}

function PersonalInfoCard({ personalInfo }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <User className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {personalInfo.map(({ label, value, secondary }) => (
          <div key={label}>
            <p className="text-xs text-slate-400 mb-1">{label}</p>
            <p className="text-sm font-medium text-slate-900">{value}</p>
            {secondary && <p className="text-xs text-slate-400 mt-0.5">{secondary}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountSettingsCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <ShieldCheck className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Account Settings</h3>
      </div>
      <div className="flex flex-col divide-y divide-slate-100">
        <button className="flex items-center justify-between py-3 text-left">
          <div>
            <p className="text-sm font-medium text-slate-900">Change Password</p>
            <p className="text-xs text-slate-400">Use "Forgot Password" from the login page</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <div className="flex items-center justify-between py-3">
          <p className="text-sm font-medium text-slate-900">Theme</p>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">Light Mode</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <p className="text-sm font-medium text-slate-900">Language</p>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">English (US)</span>
        </div>
      </div>
    </div>
  );
}

function WorkSummaryCard({ statCards }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileBarChart2 className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Work Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map(({ label, value, icon }) => {
          let Icon = ICON_BY_NAME[icon] || Gauge;
          return (
            <div key={label} className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                {label}
              </p>
              <p className="text-lg font-bold text-slate-900">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocumentsCard({ documents }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Documents</h3>
      </div>
      <div className="flex flex-col divide-y divide-slate-100">
        {documents.map(({ name, note }) => (
          <div key={name} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-red-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
                <p className="text-xs text-slate-400">{note}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 flex-shrink-0">
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyProfilePage() {
  let [bundle, setBundle] = useState(null);
  let [editing, setEditing] = useState(false);
  let [saving, setSaving] = useState(false);

  useEffect(() => {
    employeeProfileApi.getBundle().then(setBundle).catch((err) => console.error(err));
  }, []);

  if (!bundle) {
    return <div className="p-8 text-sm text-muted-foreground">Loading profile…</div>;
  }

  let { profile, statCards, documents, personalInfo } = bundle;
  let contact = personalInfo.find((p) => p.label === "Contact");

  async function handleSave(updates) {
    setSaving(true);
    try {
      let refreshedPersonalInfo = await employeeProfileApi.updatePersonalInfo(updates);
      setBundle((prev) => ({ ...prev, personalInfo: refreshedPersonalInfo, profile: { ...prev.profile, name: updates.name || prev.profile.name } }));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <ProfileHeader profile={profile} contact={contact} onEdit={() => setEditing((v) => !v)} />
          {editing && (
            <EditProfileForm
              initial={{ name: profile.name, email: contact?.value, phone: contact?.secondary }}
              onCancel={() => setEditing(false)}
              onSave={handleSave}
              saving={saving}
            />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <PersonalInfoCard personalInfo={personalInfo} />
              <WorkSummaryCard statCards={statCards} />
              <DocumentsCard documents={documents} />
            </div>
            <div className="flex flex-col gap-5">
              <AccountSettingsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
