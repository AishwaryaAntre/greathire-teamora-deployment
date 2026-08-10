import { Search, ShieldCheck, HelpCircle, CircleUserRound, Menu } from "lucide-react";
import IconButton from "./IconButton";
import { Link } from "react-router-dom";

export default function DashboardTopBar() {
  function openSidebar() {
    window.dispatchEvent(new CustomEvent("teamora:open-sidebar"));
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" onClick={openSidebar} aria-label="Open navigation">
          <Menu className="h-4 w-4" />
        </button>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            placeholder="Search employees, reports..."
            className="h-10 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <Link to="/security">
          <IconButton icon={ShieldCheck} label="Security" />
        </Link>

        <Link to="/support">
          <IconButton icon={HelpCircle} label="Help" />
        </Link>

        <Link to="/employee-dashboard">
          <IconButton icon={CircleUserRound} label="Account" />
        </Link>
      </div>
    </header>
  );
}
