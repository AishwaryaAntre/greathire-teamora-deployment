import { useNavigate, useLocation } from "react-router-dom";
import SidebarNavItem from "@/components/layout/SidebarNavItem";
import { Button } from "@/components/ui/button";
import { sidebarNav } from "@/data/employeeDashboardData";
import { attendanceApi } from "@/lib/api/attendance";
import { useAuth } from "@/lib/AuthContext";

const PATH_BY_ID = {
  dashboard: "/employee-dashboard",
  leave: "/leave",
  profile: "/profile",
  notifications: "/notifications",
  settings: "/profile",
};

export default function EmployeeSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  async function handleClockIn() {
    if (user?.employeeId) {
      await attendanceApi.checkIn(user.employeeId).catch(() => {});
    }
    navigate("/employee-dashboard");
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#171E2E] px-4 py-6">
      <div className="px-2 pb-8">
        <p className="text-xl font-bold text-white">Teamora</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Employee Portal</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarNav.map((item) => {
          const path = PATH_BY_ID[item.id];
          return (
            <SidebarNavItem
              key={item.id}
              {...item}
              active={path ? pathname.startsWith(path) : false}
              onClick={() => path && navigate(path)}
            />
          );
        })}
      </nav>

      <div className="space-y-3 pt-6">
        <Button className="w-full bg-blue-600 hover:bg-blue-600/90" onClick={handleClockIn}>
          Clock In Now
        </Button>
        <div className="space-y-1 pt-2">
          <SidebarNavItem label="Help Center" icon="HelpCircle" onClick={() => navigate("/support")} />
          <SidebarNavItem label="Logout" icon="LogOut" onClick={handleLogout} />
        </div>
      </div>
    </aside>
  );
}
