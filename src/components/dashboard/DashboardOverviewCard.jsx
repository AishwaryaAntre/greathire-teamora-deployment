import { Eye, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OverviewStatCard from "./OverviewStatCard";
import { OVERVIEW_STATS } from "@/data/dashboardData";

export default function DashboardOverviewCard() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Good Morning, Swaraj Kadam
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here is the workforce status for today, October 24th.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {OVERVIEW_STATS.map((stat) => (
          <OverviewStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="sm:w-auto">
          <Eye className="h-4 w-4" />
          View Attendance
        </Button>
        <Button size="lg" variant="outline" className="text-slate-700 sm:w-auto">
          <Download className="h-4 w-4" />
          Generate Daily Report
        </Button>
      </div>
    </Card>
  );
}
