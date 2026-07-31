import { Coffee, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  working: {
    label: "Working",
    className: "bg-emerald-50 text-emerald-700",
    dot: <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />,
  },
  break: {
    label: "Break",
    className: "bg-amber-50 text-amber-700",
    dot: <Coffee className="h-3 w-3" strokeWidth={2.5} />,
  },
  leave: {
    label: "Leave",
    className: "bg-rose-50 text-rose-700",
    dot: <LogOut className="h-3 w-3" strokeWidth={2.5} />,
  },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      {config.dot}
      {config.label}
    </span>
  );
}
