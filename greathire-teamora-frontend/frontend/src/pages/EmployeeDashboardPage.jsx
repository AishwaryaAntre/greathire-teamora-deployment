import { useEffect, useState } from "react";
import EmployeeSidebar from "@/components/layout/EmployeeSidebar";
import EmployeeTopBar from "@/components/layout/EmployeeTopBar";
import GreetingBanner from "@/components/employee/GreetingBanner";
import CurrentStatusCard from "@/components/employee/CurrentStatusCard";
import QuickActionsGrid from "@/components/employee/QuickActionsGrid";
import StatsRow from "@/components/employee/StatsRow";
import AttendanceCalendar from "@/components/employee/AttendanceCalendar";
import TimelineCard from "@/components/employee/TimelineCard";
import LeaveBalanceCard from "@/components/employee/LeaveBalanceCard";
import UpcomingHolidaysCard from "@/components/employee/UpcomingHolidaysCard";
import QuickLinksCard from "@/components/employee/QuickLinksCard";
import AttendanceSummaryCard from "@/components/employee/AttendanceSummaryCard";
import AnnouncementCard from "@/components/employee/AnnouncementCard";
import { useNavigate } from "react-router-dom";
import { employeeDashboardApi } from "@/lib/api/employeeDashboard";
import { attendanceApi } from "@/lib/api/attendance";
import { reportsApi } from "@/lib/api/reports";
import { useAuth } from "@/lib/AuthContext";

const QUICK_LINK_ROUTES = {
  history: "/attendance",
  report: "/reports",
  payslip: "/profile",
  policies: "/profile",
};

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    employeeDashboardApi
      .getBundle(user?.employeeId)
      .then((bundle) => !cancelled && setData(bundle))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, [user?.employeeId]);

  async function handleQuickAction(id) {
    if (!user?.employeeId) return;
    if (id === "check-in") await attendanceApi.checkIn(user.employeeId);
    if (id === "check-out") await attendanceApi.checkOut(user.employeeId);
    let bundle = await employeeDashboardApi.getBundle(user.employeeId);
    setData(bundle);
  }

  async function handleQuickLink(id) {
    if (id === "report") {
      await reportsApi.generate({ range: "12m", department: "All Departments" }).catch(() => {});
    }
    navigate(QUICK_LINK_ROUTES[id] || "/profile");
  }

  if (error) {
    return <div className="p-8 text-sm text-red-600">Couldn't load your dashboard: {error}</div>;
  }
  if (!data) {
    return <div className="p-8 text-sm text-muted-foreground">Loading your dashboard…</div>;
  }

  const {
    currentUser,
    currentStatus,
    quickActions,
    hoursStats,
    attendanceMonth,
    timeline,
    leaveBalances,
    upcomingHolidays,
    quickLinks,
    attendanceSummary,
    announcement,
  } = data;

  return (
    <div className="flex h-screen bg-background">
      <EmployeeSidebar />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <EmployeeTopBar user={currentUser} />

        <main className="grid flex-1 grid-cols-1 gap-6 p-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="space-y-6">
            <GreetingBanner
              name={currentUser.name}
              role={currentUser.role}
              dateLabel={currentUser.todayLabel}
              lastLogin={currentUser.lastLogin}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
              <CurrentStatusCard status={currentStatus} />
              <QuickActionsGrid actions={quickActions} onAction={handleQuickAction} />
            </div>

            <StatsRow stats={hoursStats} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
              <AttendanceCalendar month={attendanceMonth} />
              <TimelineCard items={timeline} />
            </div>

            <AttendanceSummaryCard items={attendanceSummary} />
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <LeaveBalanceCard balances={leaveBalances} onApply={() => navigate("/leave")} />
            <UpcomingHolidaysCard holidays={upcomingHolidays} />
            <QuickLinksCard links={quickLinks} onLinkClick={handleQuickLink} />
            <AnnouncementCard {...announcement} onCtaClick={() => navigate("/notifications")} />
          </div>
        </main>
      </div>
    </div>
  );
}
