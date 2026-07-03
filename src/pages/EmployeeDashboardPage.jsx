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

import {
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
} from "@/data/employeeDashboardData";

export default function EmployeeDashboardPage() {
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
              <QuickActionsGrid actions={quickActions} onAction={(id) => console.log(id)} />
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
            <LeaveBalanceCard balances={leaveBalances} onApply={() => console.log("apply for leave")} />
            <UpcomingHolidaysCard holidays={upcomingHolidays} />
            <QuickLinksCard links={quickLinks} />
            <AnnouncementCard {...announcement} onCtaClick={() => console.log("read more")} />
          </div>
        </main>
      </div>
    </div>
  );
}
