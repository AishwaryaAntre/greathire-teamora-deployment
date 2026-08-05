// Single source of truth for sidebar navigation, for both the admin and
// employee roles. Consumed by MasterSidebar (added in a later session) via
// NavItem.jsx, which expects { label, href, icon } where `icon` is a lucide
// icon *component* (not a string name).
//
// Icon choices are carried over from the existing sidebars/pages rather than
// picked fresh, so visual language stays consistent with what's already on
// screen elsewhere in the app:
//   - LayoutGrid   -> Sidebar.jsx (admin) NAV_ITEMS "Dashboard", and
//                     employeeDashboardData.js sidebarNav "dashboard"
//   - Users        -> Sidebar.jsx (admin) NAV_ITEMS "Employees"
//   - Fingerprint  -> Sidebar.jsx (admin) NAV_ITEMS "Attendance"
//   - CalendarCheck-> Sidebar.jsx (admin) NAV_ITEMS "Leave Management",
//                     and MessagesPage.jsx quick-nav
//   - BarChart3    -> Sidebar.jsx (admin) NAV_ITEMS "Reports & Analytics",
//                     and MessagesPage.jsx quick-nav
//   - MessageSquare-> MessagesPage.jsx quick-nav "Messages"
//   - Bell         -> Sidebar.jsx (admin) NAV_ITEMS "Notifications"
//   - Settings     -> Sidebar.jsx (admin) footer link, and
//                     employeeDashboardData.js sidebarNav "settings"
import {
  LayoutGrid,
  Users,
  Fingerprint,
  CalendarCheck,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
} from "lucide-react";

// Routes below are verified against frontend/src/App.jsx.
//
// NOTE (audit finding, not fixed here): App.jsx wraps /employees in a plain
// <ProtectedRoute> (any authenticated user), NOT <ProtectedRoute adminOnly>.
// The written plan describes /employees as admin-only, and it's listed under
// ADMIN_NAV_ITEMS below to match today's *sidebar* behavior (only the admin
// sidebar currently links to it), but the route itself does not enforce
// that. Flagging for a later session/ticket rather than silently changing
// route-guarding behavior as a side effect of a nav-config refactor.
export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Attendance", href: "/attendance", icon: Fingerprint },
  { label: "Leave Management", href: "/leave", icon: CalendarCheck },
  { label: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Notifications", href: "/notifications", icon: Bell },
];

export const EMPLOYEE_NAV_ITEMS = [
  { label: "Dashboard", href: "/employee-dashboard", icon: LayoutGrid },
  { label: "Attendance", href: "/attendance", icon: Fingerprint },
  { label: "Leave", href: "/leave", icon: CalendarCheck },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "My Profile", href: "/profile", icon: Settings },
];

// Role field confirmed in frontend/src/components/routing/ProtectedRoute.jsx
// (`user.role !== "admin"`) and backend/src/middleware/auth.js /
// authController.js, which set role to the lowercase strings "admin" or
// "employee". Any other/missing value is treated as non-admin.
export function getNavItemsForRole(role) {
  return role === "admin" ? ADMIN_NAV_ITEMS : EMPLOYEE_NAV_ITEMS;
}
