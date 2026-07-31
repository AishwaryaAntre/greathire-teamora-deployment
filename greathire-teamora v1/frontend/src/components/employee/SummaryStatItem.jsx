import * as icons from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function SummaryStatItem({ label, value, icon, tone }) {
  const Icon = icons[icon] ?? icons.Circle;

  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", toneClasses[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
