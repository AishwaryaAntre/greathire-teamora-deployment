import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  LayoutDashboard,
  CalendarCheck,
  Bell,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  CheckCheck,
  Download,
  LogIn as LogInIcon,
  CalendarClock,
  Cog,
  X,
} from "lucide-react";
import { notificationsApi } from "@/lib/api/notifications";
import { useAuth } from "@/lib/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Attendance", icon: CalendarCheck, to: "/attendance" },
  { label: "Notifications", icon: Bell, active: true, to: "/notifications" },
  { label: "Employees", icon: Users, to: "/employees" },
  { label: "Analytics", icon: BarChart3, to: "/reports" },
];

const filters = ["All", "Unread", "Attendance", "Leave", "System"];

// Backend sends `category` — map it to an icon client-side.
const CATEGORY_ICON = { attendance: LogInIcon, leave: CalendarClock, system: Cog };

function filterToApiValue(filter) {
  if (filter === "All") return "all";
  if (filter === "Unread") return "unread";
  return filter.toLowerCase();
}

function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col justify-between flex-shrink-0">
      <div>
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-semibold text-sm">Teamora</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">Enterprise Plan</p>
          </div>
        </div>

        <nav className="mt-2 px-3 flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, active, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                active ? "bg-slate-800 text-white" : "text-slate-400 dark:text-slate-500 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="px-3 pb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate("/support")}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 dark:text-slate-500 hover:bg-slate-800/60 hover:text-white transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            Help Center
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 dark:text-slate-500 hover:bg-slate-800/60 hover:text-white transition-colors text-left"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ search, onSearchChange }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search Notifications..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent outline-none text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 w-full"
        />
      </div>

      <div className="flex items-center gap-5 flex-shrink-0">
        <button
          onClick={() => navigate("/profile")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate("/support")}
          className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <span className="w-px h-5 bg-slate-200" />
        <button onClick={() => navigate("/support")} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Support
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-slate-200" />
      </div>
    </header>
  );
}

function PageHeader({ activeFilter, setActiveFilter, onMarkAllRead }) {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Stay updated with workforce activities and important alerts.</p>
      </div>

      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 mb-5">
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter ? "bg-slate-900 text-white" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <button onClick={onMarkAllRead} className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
          <CheckCheck className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>
    </>
  );
}

function NotificationRow({ item, onClick }) {
  const Icon = CATEGORY_ICON[item.category] || Cog;
  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-4 px-6 py-5 border-b border-slate-100 dark:border-slate-800 last:border-b-0 cursor-pointer ${
        item.unread ? "bg-blue-50/40" : "bg-white dark:bg-slate-900"
      }`}
    >
      {item.unread ? <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" /> : <span className="w-1.5 flex-shrink-0" />}

      {item.isSystem || !item.avatar ? (
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </div>
      ) : (
        <img src={item.avatar} alt={item.title} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">{item.time}</span>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md mt-2 ${item.badge.tone}`}>
          {item.badge.label}
        </span>
      </div>
    </div>
  );
}

function SummaryCard({ summary }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">Summary</h3>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {summary.map(({ label, value, tone }) => (
          <div key={label} className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3">
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">{label}</p>
            <p className={`text-xl font-bold ${tone}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const PREFERENCE_LABELS = [
  { key: "email", label: "Email alerts" },
  { key: "push", label: "Push alerts" },
  { key: "attendanceAlerts", label: "Attendance alerts" },
  { key: "leaveAlerts", label: "Leave alerts" },
  { key: "systemAlerts", label: "System alerts" },
];

function QuickActionsCard({ open, onToggle, preferences, onTogglePreference, onExport }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h3>
        {open && (
          <button onClick={onToggle} aria-label="Close notification settings" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onToggle} className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950">
          <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          Notification Settings
        </button>

        {open && (
          <div className="flex flex-col gap-3 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-3 -mt-1">
            {PREFERENCE_LABELS.map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                {label}
                <Checkbox
                  checked={!!preferences?.[key]}
                  onCheckedChange={(checked) => onTogglePreference(key, checked)}
                />
              </label>
            ))}
          </div>
        )}

        <button onClick={onExport} className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950">
          <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          Export Logs
        </button>
      </div>
    </div>
  );
}

export default function NotificationsCenterPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const refresh = useCallback(async () => {
    let [list, summaryData] = await Promise.all([
      notificationsApi.list({ filter: filterToApiValue(activeFilter), search }),
      notificationsApi.getSummary(),
    ]);
    setNotifications(list);
    setSummary(summaryData);
  }, [activeFilter, search]);

  useEffect(() => {
    refresh().catch((err) => console.error(err));
  }, [refresh]);

  useEffect(() => {
    notificationsApi.getPreferences().then(setPreferences).catch((err) => console.error(err));
  }, []);

  async function handleRowClick(item) {
    if (!item.unread) return;
    await notificationsApi.markAsRead(item.id);
    await refresh();
  }
  async function handleMarkAllRead() {
    await notificationsApi.markAllAsRead();
    await refresh();
  }
  async function handleTogglePreference(key, checked) {
    const next = { ...preferences, [key]: checked };
    setPreferences(next);
    await notificationsApi.updatePreferences({ [key]: checked }).catch((err) => console.error(err));
  }
  function handleExportLogs() {
    const header = "Title,Description,Category,Time,Unread\n";
    const rows = notifications
      .map((n) => [n.title, n.description, n.category, n.time, n.unread].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notifications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar search={search} onSearchChange={setSearch} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 min-w-0">
              <PageHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} onMarkAllRead={handleMarkAllRead} />
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {notifications.length === 0 ? (
                  <p className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">No notifications here.</p>
                ) : (
                  notifications.map((item) => (
                    <NotificationRow key={item.id} item={item} onClick={() => handleRowClick(item)} />
                  ))
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <SummaryCard summary={summary} />
              <QuickActionsCard
                open={preferencesOpen}
                onToggle={() => setPreferencesOpen((v) => !v)}
                preferences={preferences}
                onTogglePreference={handleTogglePreference}
                onExport={handleExportLogs}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
