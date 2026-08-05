import { useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { employeeProfileApi } from "@/lib/api/employeeProfile";

// Shared by EmployeesListPage.jsx (deleting from the directory) and
// EmployeeProfilePage.jsx (deleting from someone's profile). Both just need
// { employee, onClose, onDeleted } — this owns the actual API call so the
// two call sites don't duplicate the confirm-then-delete flow.
export default function ConfirmDeleteEmployeeModal({ employee, onClose, onDeleted }) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setError("");
    setDeleting(true);
    try {
      await employeeProfileApi.remove(employee.id);
      onDeleted();
    } catch (err) {
      setError(err.message || "Couldn't delete this employee.");
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
              <TriangleAlert className="h-5 w-5 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete employee</h2>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          This permanently removes <span className="font-semibold text-slate-900 dark:text-white">{employee.name}</span>'s
          employee record, login access, and their attendance and leave history. This can't be undone.
        </p>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="flex-1 bg-red-600 text-white shadow-sm hover:bg-red-700"
          >
            {deleting ? "Deleting…" : "Delete employee"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
