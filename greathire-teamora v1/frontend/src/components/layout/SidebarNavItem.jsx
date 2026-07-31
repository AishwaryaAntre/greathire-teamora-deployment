import * as icons from "lucide-react";
import { cn } from "@/lib/utils";

export default function SidebarNavItem({ label, icon, active = false, onClick }) {
  const Icon = icons[icon] ?? icons.Circle;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-white dark:bg-slate-900/10 text-white"
          : "text-slate-300 hover:bg-white dark:hover:bg-slate-900/5 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}
