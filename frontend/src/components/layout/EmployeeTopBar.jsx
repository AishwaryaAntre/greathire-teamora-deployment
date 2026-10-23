import { Bell, HelpCircle, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeContext";
import { useEffect, useState } from "react";
import { notificationsApi } from "@/lib/api/notifications";
import ProfileAvatarButton from "./ProfileAvatarButton";

export default function EmployeeTopBar({ user  }) {
  const { isDark, toggleTheme } = useTheme();
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

        if (!active || !Array.isArray(response)) return;

        setHasUnreadNotifications(
          response.some((item) => item.unread === true)
        );
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
    <header className="flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3 sm:px-6 lg:px-8">
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        onClick={openSidebar}
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>
      <div className="ml-auto flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate("/support")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Help"
          title="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Toggle theme"
          title="Toggle theme"
          onClick={toggleTheme}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="flex min-w-0 items-center gap-2 border-l border-border pl-3 sm:gap-3 sm:pl-4">
          <div className="min-w-0 text-right leading-tight">
            <p className="max-w-[min(12rem,35vw)] truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="text-xs capitalize text-muted-foreground">
              {user.role ? `${user.role} Access` : "Access"}
            </p>
          </div>
          <ProfileAvatarButton name={user?.name || "Employee"} />
        </div>
      </div>
    </header>
  );
}
