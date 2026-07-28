import { Eye, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OverviewStatCard from "./OverviewStatCard";

export default function DashboardOverviewCard({ adminName, dateLabel, stats, onViewAttendance, onGenerateReport }) {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Good Morning, {adminName}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here is the workforce status for today, {dateLabel}.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {stats.map((stat) => (
          <OverviewStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="sm:w-auto" onClick={onViewAttendance}>
          <Eye className="h-4 w-4" />
          View Attendance
        </Button>
        <Button size="lg" variant="outline" className="text-slate-700 sm:w-auto" onClick={onGenerateReport}>
          <Download className="h-4 w-4" />
          Generate Daily Report
        </Button>
      </div>
    </Card>
  );
}
