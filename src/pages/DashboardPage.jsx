import Sidebar from "@/components/layout/Sidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import DashboardOverviewCard from "@/components/dashboard/DashboardOverviewCard";
import WorkforceSnapshot from "@/components/dashboard/WorkforceSnapshot";
import MetricRow from "@/components/dashboard/MetricRow";
import LiveWorkforceTable from "@/components/dashboard/LiveWorkforceTable";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-5 px-8 py-6">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <DashboardOverviewCard />
            </div>
            <WorkforceSnapshot />
          </div>

          <MetricRow />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <LiveWorkforceTable />
            </div>
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}
