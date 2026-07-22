import Sidebar from "@/components/layout/Sidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import DashboardOverviewCard from "@/components/dashboard/DashboardOverviewCard";
import WorkforceSnapshot from "@/components/dashboard/WorkforceSnapshot";
import MetricRow from "@/components/dashboard/MetricRow";
import LiveWorkforceTable from "@/components/dashboard/LiveWorkforceTable";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  const { overview, snapshot, metrics, workforce, activity, loading, error } = useDashboardData();

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-5 px-8 py-6">
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          {loading ? (
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <DashboardOverviewCard
                    adminName={overview?.adminName}
                    dateLabel={overview?.dateLabel}
                    stats={overview?.stats}
                  />
                </div>
                <WorkforceSnapshot stats={snapshot} />
              </div>

              <MetricRow metrics={metrics} />

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <div className="xl:col-span-2">
                  <LiveWorkforceTable workforce={workforce} />
                </div>
                <RecentActivity activity={activity} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
