import { Bell, HelpCircle, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeContext";
import { useEffect, useState } from "react";
import { notificationsApi } from "@/lib/api/notifications";

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
    <header className="flex items-center gap-4 border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
      <button type="button" className="rounded-lg border border-border p-2 text-foreground hover:bg-accent lg:hidden" onClick={openSidebar} aria-label="Open navigation">
        <Menu className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-4">
        
<button
  type="button"
  onClick={() => navigate("/notifications")}
  className="relative text-muted-foreground hover:text-foreground"
  aria-label="Notifications"
>
  <Bell className="h-5 w-5" />

  {hasUnreadNotifications && (
    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
  )}
</button>

        <button
          onClick={() => navigate("/support")}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          className="text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role ? `${user.role} Access` : "Access"}</p>
          </div>
          <div className="h-9 w-9 overflow-hidden rounded-full bg-secondary">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted-foreground">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
