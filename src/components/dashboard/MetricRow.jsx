import { Users2, Coffee, ArrowUp } from "lucide-react";
import MetricCard from "./MetricCard";

export default function MetricRow() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        label="TOTAL EMPLOYEES"
        value="156"
        right={
          <Users2 className="h-5 w-5 text-slate-400" strokeWidth={2} />
        }
      />

      <MetricCard
        label="CURRENTLY WORKING"
        value="130"
        valueClassName="text-blue-700"
        right={
          <div className="h-1.5 w-14 rounded-full bg-blue-100">
            <div className="h-1.5 w-4/5 rounded-full bg-blue-600" />
          </div>
        }
      />

      <MetricCard
        label="ON BREAK"
        value="12"
        valueClassName="text-amber-600"
        right={
          <Coffee className="h-5 w-5 text-amber-500" strokeWidth={2} />
        }
      />

      <MetricCard
        label="AVG WORKING HRS"
        value="8.2h"
        right={
          <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
            <ArrowUp className="h-3 w-3" strokeWidth={2.5} />
            2%
          </span>
        }
      />
    </div>
  );
}
