import { Search, ShieldCheck, HelpCircle, CircleUserRound } from "lucide-react";
import IconButton from "./IconButton";

export default function DashboardTopBar() {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-slate-200/80 bg-white/60 px-8 py-4">
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search employees, reports..."
          className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <IconButton icon={ShieldCheck} label="Security" />
        <IconButton icon={HelpCircle} label="Help" />
        <IconButton icon={CircleUserRound} label="Account" />
      </div>
    </header>
  );
}
