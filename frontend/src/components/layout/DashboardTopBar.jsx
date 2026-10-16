
import {
  ShieldCheck,
  HelpCircle,
  CircleUserRound,
  Menu,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@/lib/ThemeContext";
import { useEffect, useState } from "react";
import { notificationsApi } from "@/lib/api/notifications";
import IconButton from "./IconButton";

export default function DashboardTopBar() {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] =
    useState(false);

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
          : response?.data;

        if (Array.isArray(items)) {
          setHasUnreadNotifications(
            items.some((item) => item.unread === true)
          );
        }
      } catch (error) {
        console.error("Failed to check unread notifications:", error);
      }
    }

    checkNotifications();
    const timer = window.setInterval(checkNotifications, 5000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  function openSidebar() {
    window.dispatchEvent(new CustomEvent("teamora:open-sidebar"));
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          onClick={openSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          aria-label="Notifications"
          title="Notifications"
          className="relative text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <Link to="/security">
          <IconButton icon={ShieldCheck} label="Security" />
        </Link>

        <Link to="/support">
          <IconButton icon={HelpCircle} label="Help" />
        </Link>

        <Link to="/employee-dashboard">
          <IconButton icon={CircleUserRound} label="Account" />
        </Link>
      </div>
    </header>
  );
}
