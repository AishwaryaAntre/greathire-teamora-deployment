import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import { Card } from "@/components/ui/card";
import Avatar from "@/components/dashboard/Avatar";
import { employeeProfileApi } from "@/lib/api/employeeProfile";

export default function EmployeesListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    employeeProfileApi
      .getAll()
      .then((data) => !cancelled && setEmployees(data))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <div className="p-8 text-sm text-red-600">Couldn't load employees: {error}</div>;
  }
  if (!employees) {
    return <div className="p-8 text-sm text-muted-foreground">Loading employees…</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-5 px-8 py-6">
          <h1 className="text-xl font-bold text-slate-900">Employees</h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                onClick={() => navigate(`/employees/${employee.id}`)}
                className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-slate-50"
              >
                <Avatar initials={employee.initials} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{employee.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {employee.role} · {employee.department}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
