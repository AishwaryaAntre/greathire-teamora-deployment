import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, X, Trash2 } from "lucide-react";
import MasterSidebar from "@/components/layout/MasterSidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Avatar from "@/components/dashboard/Avatar";
import ConfirmDeleteEmployeeModal from "@/components/employee/ConfirmDeleteEmployeeModal";
import { employeeProfileApi } from "@/lib/api/employeeProfile";
import { useAuth } from "@/lib/AuthContext";
import PageLoading from "@/components/routing/PageLoading";
import PageError from "@/components/routing/PageError";

function AddEmployeeModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "", phone: "", role: "employee" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await employeeProfileApi.create(form);
      onCreated();
    } catch (err) {
      setError(err.message || "Couldn't create the account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Employee</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required value={form.name} onChange={set("name")} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={form.email} onChange={set("email")} />
          </div>
          <div>
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" type="password" required minLength={8} value={form.password} onChange={set("password")} />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={form.department} onChange={set("department")} placeholder="e.g. Engineering" />
          </div>
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input id="phone" value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <Label htmlFor="role">Account type</Label>
            <select
              id="role"
              value={form.role}
              onChange={set("role")}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating…" : "Create account"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function EmployeesListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employees, setEmployees] = useState(null);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const isAdmin = user?.role === "admin";

  function loadEmployees() {
    employeeProfileApi
      .getAll()
      .then(setEmployees)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  if (error) {
    return <PageError message={`Couldn't load employees: ${error}`} onRetry={loadEmployees} />;
  }
  if (!employees) {
    return <PageLoading label="Loading employees…" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-5 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Employees</h1>
            {isAdmin && (
              <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Employee
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                onClick={() => navigate(`/employees/${employee.id}`)}
                className="flex cursor-pointer items-center gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-950"
              >
                <Avatar initials={employee.initials} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{employee.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {employee.role} · {employee.department}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(employee);
                    }}
                    disabled={employee.id === user?.employeeId}
                    title={employee.id === user?.employeeId ? "You can't delete your own account" : "Delete employee"}
                    className="flex-shrink-0 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 dark:text-slate-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </Card>
            ))}
          </div>
        </main>
      </div>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            loadEmployees();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteEmployeeModal
          employee={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            loadEmployees();
          }}
        />
      )}
    </div>
  );
}
