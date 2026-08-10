import { Search, Bell, HelpCircle, Moon, Sun, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/lib/ThemeContext";

export default function EmployeeTopBar({ user }) {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function openSidebar() {
    window.dispatchEvent(new CustomEvent("teamora:open-sidebar"));
  }

  return (
    <header className="flex items-center gap-4 border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
      <button type="button" className="rounded-lg border border-border p-2 text-foreground hover:bg-accent lg:hidden" onClick={openSidebar} aria-label="Open navigation">
        <Menu className="h-4 w-4" />
      </button>
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for files, tools, people..."
          className="h-10 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/notifications")}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
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
            <p className="text-xs text-muted-foreground">Admin Access</p>
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
