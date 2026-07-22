import { LayoutGrid } from "lucide-react";
import { Card } from "@/components/ui/card";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";
import { getInitials, getAvatarClass, formatTime } from "@/lib/format";

export default function LiveWorkforceTable({ workforce = [] }) {
  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-[18px] w-[18px] text-slate-700" strokeWidth={2} />
          <h2 className="text-base font-bold text-slate-900">Live Workforce</h2>
        </div>
        <a
          href="#view-all"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </a>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-slate-400">
              <th className="pb-3 font-semibold">EMPLOYEE</th>
              <th className="pb-3 font-semibold">ROLE</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold">CHECK-IN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {workforce.map((employee) => (
              <tr key={employee.name}>
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={getInitials(employee.name)}
                      className={getAvatarClass(employee.name)}
                    />
                    <span className="text-sm font-semibold text-slate-900">
                      {employee.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 text-sm text-slate-500">{employee.role}</td>
                <td className="py-3.5">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="py-3.5 text-sm text-slate-500">
                  {formatTime(employee.checkIn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
