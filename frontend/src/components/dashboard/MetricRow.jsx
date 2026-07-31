import { Users2, Coffee, ArrowUp, ArrowDown } from "lucide-react";
import MetricCard from "./MetricCard";

export default function MetricRow({ metrics }) {
  if (!metrics) return null;
  const {
    totalEmployees,
    currentlyWorking,
    onBreak,
    avgWorkingHours,
    avgWorkingHoursTrendPct,
  } = metrics;
  const trendUp = avgWorkingHoursTrendPct >= 0;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        label="TOTAL EMPLOYEES"
        value={String(totalEmployees)}
        right={<Users2 className="h-5 w-5 text-slate-400 dark:text-slate-500" strokeWidth={2} />}
      />

      <MetricCard
        label="CURRENTLY WORKING"
        value={String(currentlyWorking)}
        valueClassName="text-blue-700"
        right={
          <div className="h-1.5 w-14 rounded-full bg-blue-100">
            <div
              className="h-1.5 rounded-full bg-blue-600"
              style={{ width: totalEmployees ? `${Math.min(100, Math.round((currentlyWorking / totalEmployees) * 100))}%` : "0%" }}
            />
          </div>
        }
      />

      <MetricCard
        label="ON BREAK"
        value={String(onBreak)}
        valueClassName="text-amber-600"
        right={<Coffee className="h-5 w-5 text-amber-500" strokeWidth={2} />}
      />

      <MetricCard
        label="AVG WORKING HRS"
        value={`${avgWorkingHours}h`}
        right={
          <span
            className={`flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold ${
              trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {trendUp ? <ArrowUp className="h-3 w-3" strokeWidth={2.5} /> : <ArrowDown className="h-3 w-3" strokeWidth={2.5} />}
            {Math.abs(avgWorkingHoursTrendPct)}%
          </span>
        }
      />
    </div>
  );
}
