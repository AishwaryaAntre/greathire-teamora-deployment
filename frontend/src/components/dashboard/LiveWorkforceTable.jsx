import { LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Avatar from "./Avatar";
import StatusBadge from "./StatusBadge";

export default function LiveWorkforceTable({ workforce = [] }) {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-[18px] w-[18px] text-slate-700 dark:text-slate-200" strokeWidth={2} />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Workforce</h2>
        </div>
        <button
          type="button"
          onClick={() => navigate("/employees")}
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="text-xs font-semibold tracking-wide text-slate-400 dark:text-slate-500">
              <th className="pb-3 font-semibold">EMPLOYEE</th>
              <th className="pb-3 font-semibold">ROLE</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold">CHECK-IN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {workforce.map((employee) => (
              <tr
                key={employee.id || employee.name}
                onClick={() => employee.id && navigate(`/employees/${employee.id}`)}
                className={employee.id ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950" : ""}
              >
                <td className="py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={employee.initials}
                      className={employee.avatarClass}
                    />
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {employee.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 text-sm text-slate-500 dark:text-slate-400">{employee.role}</td>
                <td className="py-3.5">
                  <StatusBadge status={employee.status} />
                </td>
                <td className="py-3.5 text-sm text-slate-500 dark:text-slate-400">
                  {employee.checkIn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
