import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MasterSidebar from "@/components/layout/MasterSidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import DashboardOverviewCard from "@/components/dashboard/DashboardOverviewCard";
import WorkforceSnapshot from "@/components/dashboard/WorkforceSnapshot";
import MetricRow from "@/components/dashboard/MetricRow";
import LiveWorkforceTable from "@/components/dashboard/LiveWorkforceTable";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { dashboardApi } from "@/lib/api/dashboard";
import { reportsApi } from "@/lib/api/reports";
import { useAuth } from "@/lib/AuthContext";
import PageLoading from "@/components/routing/PageLoading";
import PageError from "@/components/routing/PageError";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    dashboardApi
      .getAll()
      .then((bundle) => !cancelled && setData(bundle))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGenerateReport() {
    await reportsApi.generate({ range: "12m", department: "All Departments" });
    navigate("/reports");
  }

  if (error) {
    return <PageError message={`Couldn't load the dashboard: ${error}`} onRetry={() => window.location.reload()} />;
  }
  if (!data) {
    return <PageLoading label="Loading dashboard…" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <DashboardOverviewCard
                {...data.overview}
                name={user?.name || data.overview?.adminName}
                onViewAttendance={() => navigate("/attendance")}
                onGenerateReport={handleGenerateReport}
              />
            </div>
            <WorkforceSnapshot stats={data.snapshot} />
          </div>

          <MetricRow metrics={data.metrics} />

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 items-stretch">
            <div className="xl:col-span-2">
              <LiveWorkforceTable workforce={data.liveWorkforce} />
            </div>
            <RecentActivity activity={data.recentActivity} />
          </div>
        </main>
      </div>
    </div>
  );
}
