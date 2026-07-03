import SidebarNavItem from "@/components/layout/SidebarNavItem";
import { Button } from "@/components/ui/Button";
import { sidebarNav } from "@/data/employeeDashboardData";

export default function EmployeeSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#171E2E] px-4 py-6">
      <div className="px-2 pb-8">
        <p className="text-xl font-bold text-white">Teamora</p>
        <p className="text-xs text-slate-400">Employee Portal</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarNav.map((item) => (
          <SidebarNavItem key={item.id} {...item} />
        ))}
      </nav>

      <div className="space-y-3 pt-6">
        <Button className="w-full bg-blue-600 hover:bg-blue-600/90">Clock In Now</Button>
        <div className="space-y-1 pt-2">
          <SidebarNavItem label="Help Center" icon="HelpCircle" />
          <SidebarNavItem label="Logout" icon="LogOut" />
        </div>
      </div>
    </aside>
  );
}
