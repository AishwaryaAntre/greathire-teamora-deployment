import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavItem({ icon: Icon, label, active, href }) {
  return (
    <Link
      to={href || "#"}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-white dark:bg-slate-900/10 text-white font-semibold"
          : "text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-900/5 hover:text-slate-200"
      )}
    >
      {active && (
        <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
      )}
      <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );
}
