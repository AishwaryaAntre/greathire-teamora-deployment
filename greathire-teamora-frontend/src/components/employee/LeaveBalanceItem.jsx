import * as icons from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function LeaveBalanceItem({ label, sublabel, value, icon, tone }) {
  const Icon = icons[icon] ?? icons.Circle;

  return (
    <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", toneClasses[tone])}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{sublabel}</p>
        </div>
      </div>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  );
}
