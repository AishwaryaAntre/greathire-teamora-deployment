import { useLocation, useNavigate } from "react-router-dom";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { getNavItemsForRole } from "@/data/navConfig";
import { attendanceApi } from "@/lib/api/attendance";
import { Button } from "@/components/ui/button";
import NavItem from "./NavItem";

// Single, role-aware sidebar replacing Sidebar.jsx (admin) and
// EmployeeSidebar.jsx (employee), plus the 5 hardcoded local copies.
// Visual standard adopted is the admin look from Sidebar.jsx (bg-slate-900,
// 280px, "GreatHire / TEAMORA" brand block) — copied verbatim below so the
// 2 pages already using Sidebar.jsx see no visual regression once wired in.
//
// NOT rendered anywhere yet — this session only builds the component.
export default function MasterSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin"; // confirmed field/value in Session 1 (ProtectedRoute.jsx, backend authController.js)
  const items = getNavItemsForRole(user?.role);

  // Ported from EmployeeSidebar.jsx's handleClockIn — unchanged behavior.
  async function handleClockIn() {
    if (user?.employeeId) {
      await attendanceApi.checkIn(user.employeeId).catch(() => {});
    }
    navigate("/attendance");
  }

  // Logout was previously only on EmployeeSidebar.jsx. Intentional behavior
  // change (see Session 2 commit message): admins now get a Logout entry
  // too, since Sidebar.jsx had no sign-out affordance at all before.
  async function handleLogout() {
    await logout();
    navigate("/");
  }


  return (
    <aside className="flex h-100p w-[280px] shrink-0 flex-col bg-slate-900 px-6 py-7">
      {/* Brand block — copied verbatim from Sidebar.jsx */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark text-primary-foreground ring-2 ring-white ring-offset-2 ring-offset-black dark:bg-slate-900/10 text-white">
          <span className="text-sm font-extrabold">
            {/* <img src="/grlogo.jpeg" className="h-8 w-8 rounded-md object-cover" /> */}
              ≫
          </span>
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-white">TEAMORA</p>
          
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1.5 pl-4">
        {items.map((item) => (
          <NavItem key={item.label} {...item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>

      <div className="border-t border-white/10 pl-4 pt-5 space-y-1.5">
        <NavItem icon={Settings} label="Settings" href="/profile" active={pathname === "/profile"} />

        {!isAdmin && (
          <>
            {/* -ml-4 cancels the pl-4 indent used for NavItem's active bar,
                so the button stays flush/full-width like it was in
                EmployeeSidebar.jsx rather than looking inset. */}
            <div className="-ml-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-600/90"
                onClick={handleClockIn}
              >
                Clock In Now
              </Button>
            </div>
            <NavItem icon={HelpCircle} label="Help Center" href="/support" active={pathname === "/support"} />
          </>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="group relative flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-400 dark:text-slate-500 transition-colors hover:bg-[#1E293B] dark:hover:bg-[#1E293B] hover:text-slate-200"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
