import { PieChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import SnapshotRow from "./SnapshotRow";
import { SNAPSHOT_STATS } from "@/data/dashboardData";

export default function WorkforceSnapshot() {
  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center gap-2">
        <PieChart className="h-[18px] w-[18px] text-slate-700" strokeWidth={2} />
        <h2 className="text-base font-bold text-slate-900">Workforce Snapshot</h2>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-between gap-5">
        {SNAPSHOT_STATS.map((stat) => (
          <SnapshotRow key={stat.label} {...stat} />
        ))}
      </div>
    </Card>
  );
}
