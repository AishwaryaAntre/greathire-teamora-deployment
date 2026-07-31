import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/data/dashboardData";
import NavItem from "./NavItem";

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="flex h-100p w-[280px] shrink-0 flex-col bg-slate-900 px-6 py-7">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-sm font-extrabold">G</span>
        </div>
        <div>
          <p className="text-lg font-bold leading-tight text-white">GreatHire</p>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 dark:text-slate-500">
            TEAMORA
          </p>
        </div>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1.5 pl-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} {...item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>

      <div className="border-t border-white/10 pl-4 pt-5">
        <NavItem icon={Settings} label="Settings" href="/profile" active={pathname === "/profile"} />
      </div>
    </aside>
  );
}
