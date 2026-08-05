import { useEffect, useState } from "react";
import MasterSidebar from "@/components/layout/MasterSidebar";
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
import ApplyLeaveModal from "@/components/employee/ApplyLeaveModal";
import { useNavigate } from "react-router-dom";
import { employeeDashboardApi } from "@/lib/api/employeeDashboard";
import { attendanceApi } from "@/lib/api/attendance";
import { reportsApi } from "@/lib/api/reports";
import { useAuth } from "@/lib/AuthContext";
import PageLoading from "@/components/routing/PageLoading";
import PageError from "@/components/routing/PageError";

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
  const [calendarCursor, setCalendarCursor] = useState(null); // { year, month } | null = current month
  const [attendanceMonthOverride, setAttendanceMonthOverride] = useState(null);
  const [applyLeaveOpen, setApplyLeaveOpen] = useState(false);
  const [actionError, setActionError] = useState("");

  function refreshBundle() {
    employeeDashboardApi
      .getBundle(user?.employeeId)
      .then(setData)
      .catch(() => {});
  }

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

  useEffect(() => {
    if (!calendarCursor) {
      setAttendanceMonthOverride(null);
      return;
    }
    let cancelled = false;
    employeeDashboardApi
      .getAttendanceMonth({ year: calendarCursor.year, month: calendarCursor.month, employeeId: user?.employeeId })
      .then((month) => !cancelled && setAttendanceMonthOverride(month))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [calendarCursor, user?.employeeId]);

  function shiftMonth(delta) {
    const now = new Date();
    const base = calendarCursor || { year: now.getFullYear(), month: now.getMonth() };
    let month = base.month + delta;
    let year = base.year;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    setCalendarCursor({ year, month });
  }

  async function handleQuickAction(id) {
    if (!user?.employeeId) return;
    setActionError("");
    try {
      if (id === "check-in") await attendanceApi.checkIn(user.employeeId);
      if (id === "check-out") await attendanceApi.checkOut(user.employeeId);
      if (id === "start-break") await attendanceApi.startBreak(user.employeeId);
      if (id === "resume-work") await attendanceApi.resumeWork(user.employeeId);
    } catch (err) {
      setActionError(err.message);
      return;
    }
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
    return <PageError message={`Couldn't load your dashboard: ${error}`} onRetry={() => window.location.reload()} />;
  }
  if (!data) {
    return <PageLoading label="Loading your dashboard…" />;
  }

  const {
    currentUser,
    currentStatus,
    quickActions,
    hoursStats,
    timeline,
    leaveBalances,
    upcomingHolidays,
    quickLinks,
    attendanceSummary,
    announcement,
  } = data;

  return (
    <div className="flex h-screen bg-background">
      <MasterSidebar />

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

            {actionError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {actionError}
              </div>
            )}

            <StatsRow stats={hoursStats} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
              <AttendanceCalendar
                month={attendanceMonthOverride || data.attendanceMonth}
                onPrevMonth={() => shiftMonth(-1)}
                onNextMonth={() => shiftMonth(1)}
              />
              <TimelineCard items={timeline} />
            </div>

            <AttendanceSummaryCard items={attendanceSummary} />
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <LeaveBalanceCard balances={leaveBalances} onApply={() => setApplyLeaveOpen(true)} />
            <UpcomingHolidaysCard holidays={upcomingHolidays} />
            <QuickLinksCard links={quickLinks} onLinkClick={handleQuickLink} />
            <AnnouncementCard {...announcement} onCtaClick={() => navigate("/notifications")} />
          </div>
        </main>
      </div>

      <ApplyLeaveModal
        open={applyLeaveOpen}
        onClose={() => setApplyLeaveOpen(false)}
        onSubmitted={refreshBundle}
      />
    </div>
  );
}
