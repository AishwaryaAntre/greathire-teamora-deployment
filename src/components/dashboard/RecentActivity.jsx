import { History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getActivityDotClass } from "@/lib/format";

export default function RecentActivity({ activity = [] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <History className="h-[18px] w-[18px] text-slate-700" strokeWidth={2} />
        <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
      </div>

      <ul className="mt-5 flex flex-col gap-5">
        {activity.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${getActivityDotClass(item.type)}`}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {item.text}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
