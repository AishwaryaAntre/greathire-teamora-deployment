import React from "react";
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
  MapPin,
  Calendar,
  User,
  ChevronRight,
  ShieldCheck,
  Gauge,
  FileText,
  Download,
  Clock3,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Static data                                                                */
/* -------------------------------------------------------------------------- */

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Attendance", icon: CalendarCheck },
  { label: "Schedules", icon: CalendarClock },
  { label: "Employees", icon: Users, active: true },
  { label: "Reports", icon: FileBarChart2 },
];

const profile = {
  name: "Swaraj Kadam",
  role: "Software Engineer",
  id: "GH-1024",
  email: "swaraj.k@babde.com",
  phone: "+91 98765 43210",
  location: "Pune, India",
  joined: "Joined Oct 12, 2021",
  avatar: "https://i.pravatar.cc/160?img=51",
};

const personalInfo = [
  { label: "Full Name", value: "Swaraj Kadam" },
  { label: "Department", value: "Engineering" },
  { label: "Email Address", value: "swaraj.k@babde.com" },
  {
    label: "Reporting Manager",
    value: "Vivek Joshi",
    avatar: "https://i.pravatar.cc/64?img=33",
  },
  { label: "Phone Number", value: "+91 98765 43210" },
  { label: "Emergency Contact", value: "+91 99887 76655 (Brother)" },
];

const workSummary = [
  { label: "Attendance", value: "98.2%", icon: Gauge },
  { label: "Avg. Hours", value: "8.2h", icon: Clock3 },
  { label: "Leave Bal.", value: "12d", icon: CalendarCheck },
  { label: "Perf. Score", value: "4.8/5.0", icon: FileBarChart2 },
];

const documents = [
  { name: "Resume.pdf", note: "Added Oct 2021 • 2.4 MB" },
  { name: "Offer_Letter.pdf", note: "Added Oct 2021 • 1.1 MB" },
  { name: "Government_ID.pdf", note: "Added Oct 2021 • 4.5 MB" },
];

const recentActivity = [
  { title: "Checked in", time: "Today, 09:02 AM", current: true },
  { title: "Leave requested (Sick Leave)", time: "Yesterday, 14:30 PM" },
  { title: "Profile updated", time: "2 days ago" },
];

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

function Sidebar() {
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
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-lg">
            Clock In
          </button>
        </div>

        <nav className="px-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
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

/* -------------------------------------------------------------------------- */
/* TopBar                                                                     */
/* -------------------------------------------------------------------------- */

function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-200 flex-shrink-0">
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 w-72">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-slate-600 placeholder-slate-400 w-full"
        />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0 ml-auto">
        <button className="text-slate-500 hover:text-slate-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700">
          <MessageSquare className="w-5 h-5" />
        </button>
        <button className="text-slate-500 hover:text-slate-700">
          <Grid3x3 className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
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
/* Profile header                                                            */
/* -------------------------------------------------------------------------- */

function ProfileHeader() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500 mt-1">
              {profile.role} • ID: {profile.id}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profile.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {profile.joined}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Working
            </span>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Personal Info + Account Settings                                          */
/* -------------------------------------------------------------------------- */

function PersonalInfoCard() {
  const [row1, row2, row3] = [
    personalInfo.slice(0, 2),
    personalInfo.slice(2, 4),
    personalInfo.slice(4, 6),
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <User className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
      </div>
      <div className="flex flex-col gap-5">
        {[row1, row2, row3].map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-6">
            {row.map(({ label, value, avatar }) => (
              <div key={label}>
                <p className="text-xs text-slate-400 mb-1">{label}</p>
                {avatar ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={avatar}
                      alt={value}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <p className="text-sm font-medium text-slate-900">{value}</p>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-900">{value}</p>
                )}
              </div>
            ))}
          </div>
        ))}
        <div className="border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400 mb-1">Residential Address</p>
          <p className="text-sm font-medium text-slate-900">
            123, Tech Park Avenue, Hinjewadi Phase 1, Pune, Maharashtra 411057,
            India
          </p>
        </div>
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
            <p className="text-xs text-slate-400">Last changed 3 months ago</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-slate-900">
              Two-Factor Authentication
            </p>
            <p className="text-xs text-slate-400">Secure your account</p>
          </div>
          <span className="w-10 h-6 rounded-full bg-blue-600 relative flex items-center px-1">
            <span className="w-4 h-4 rounded-full bg-white ml-auto" />
          </span>
        </div>
        <button className="flex items-center justify-between py-3 text-left">
          <p className="text-sm font-medium text-slate-900">
            Notification Preferences
          </p>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
        <div className="flex items-center justify-between py-3">
          <p className="text-sm font-medium text-slate-900">Theme</p>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
            Light Mode
          </span>
        </div>
        <div className="flex items-center justify-between py-3">
          <p className="text-sm font-medium text-slate-900">Language</p>
          <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md">
            English (US)
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Work Summary + Documents + Recent Activity                                */
/* -------------------------------------------------------------------------- */

function WorkSummaryCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileBarChart2 className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Work Summary</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {workSummary.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
              <Icon className="w-3.5 h-3.5 text-slate-400" />
              {label}
            </p>
            <p className="text-lg font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsCard() {
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
                <p className="text-sm font-medium text-slate-900 truncate">
                  {name}
                </p>
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

function RecentActivityCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock3 className="w-5 h-5 text-slate-700" />
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
      </div>
      <div className="flex flex-col gap-4">
        {recentActivity.map(({ title, time, current }, i) => (
          <div key={title} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  current ? "bg-blue-600" : "bg-slate-300"
                }`}
              />
              {i < recentActivity.length - 1 && (
                <span className="w-px flex-1 bg-slate-200 mt-1" />
              )}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-slate-900">{title}</p>
              <p className="text-xs text-slate-400">{time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2">
        View All Activity
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main export                                                                */
/* -------------------------------------------------------------------------- */

export default function MyProfilePage() {
  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <ProfileHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <PersonalInfoCard />
              <WorkSummaryCard />
              <DocumentsCard />
            </div>
            <div className="flex flex-col gap-5">
              <AccountSettingsCard />
              <RecentActivityCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
