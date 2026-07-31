import * as icons from "lucide-react";
import { cn } from "@/lib/utils";

const toneClasses = {
  success: "bg-emerald-50 text-emerald-600",
  warning: "bg-amber-50 text-amber-600",
  info: "bg-blue-50 text-blue-600",
  danger: "bg-rose-50 text-rose-600",
};

export default function QuickActionButton({ label, icon, tone = "info", onClick }) {
  const Icon = icons[icon] ?? icons.Circle;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-secondary"
    >
      <span className={cn("flex h-9 w-9 items-center justify-center rounded-full", toneClasses[tone])}>
        <Icon className="h-4 w-4" />
      </span>
      {label}
    </button>
  );
}
