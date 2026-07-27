import { History } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function RecentActivity({ activity = [] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <History className="h-[18px] w-[18px] text-slate-700" strokeWidth={2} />
        <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
      </div>

      <ul className="mt-5 flex flex-col gap-5">
        {activity.map((entry) => (
          <li key={entry.id} className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${entry.dotClass}`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {entry.text}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{entry.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
