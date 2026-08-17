import { useEffect, useState } from "react";
import { Briefcase, Plus, X, Trash2, Pencil, Users, CalendarClock, TriangleAlert } from "lucide-react";
import MasterSidebar from "@/components/layout/MasterSidebar";
import DashboardTopBar from "@/components/layout/DashboardTopBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { projectsApi, PROJECT_IMPORTANCE_OPTIONS, PROJECT_STATUS_OPTIONS } from "@/lib/api/projects";
import { employeeProfileApi } from "@/lib/api/employeeProfile";
import PageLoading from "@/components/routing/PageLoading";
import PageError from "@/components/routing/PageError";
import { StatusBadge, ImportanceBadge, formatDateShort } from "@/lib/projectDisplay";

/** Shared create/edit form. When `project` is passed, submits a PATCH against
 * that project's id; otherwise POSTs a new one. Admin-only — full field set. */
function ProjectFormModal({ project, employees, onClose, onSaved }) {
  const isEdit = !!project;
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    teamMemberIds: project?.teamMemberIds || [],
    projectManagerId: project?.projectManagerId || "",
    endDate: project?.endDate || "",
    importance: project?.importance || "Medium",
    status: project?.status || "Active",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function toggleTeamMember(employeeId, checked) {
    setForm((f) => ({
      ...f,
      teamMemberIds: checked ? [...f.teamMemberIds, employeeId] : f.teamMemberIds.filter((id) => id !== employeeId),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.teamMemberIds.length) {
      setError("Select at least one employee to work on this project.");
      return;
    }
    setSubmitting(true);
    try {
      let payload = { ...form, projectManagerId: form.projectManagerId || null };
      if (isEdit) {
        await projectsApi.update(project.id, payload);
      } else {
        await projectsApi.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message || "Couldn't save this project.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{isEdit ? "Edit Project" : "Add Project"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="name">Project name</Label>
            <Input id="name" required value={form.name} onChange={set("name")} />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <textarea
              id="description"
              value={form.description}
              onChange={set("description")}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <Label>Team members</Label>
            <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 p-2 space-y-1.5">
              {employees.map((emp) => (
                <label key={emp.id} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
                  <Checkbox
                    checked={form.teamMemberIds.includes(emp.id)}
                    onCheckedChange={(checked) => toggleTeamMember(emp.id, checked)}
                  />
                  {emp.name} <span className="text-slate-400 dark:text-slate-500">· {emp.department}</span>
                </label>
              ))}
              {employees.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">No employees yet.</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="projectManagerId">Project manager</Label>
            <select
              id="projectManagerId"
              value={form.projectManagerId}
              onChange={set("projectManagerId")}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              <option value="">— None —</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" type="date" required value={form.endDate} onChange={set("endDate")} />
            </div>
            <div>
              <Label htmlFor="importance">Importance</Label>
              <select
                id="importance"
                value={form.importance}
                onChange={set("importance")}
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {PROJECT_IMPORTANCE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={form.status}
              onChange={set("status")}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            >
              {PROJECT_STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function ConfirmDeleteProjectModal({ project, onClose, onDeleted }) {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setError("");
    setDeleting(true);
    try {
      await projectsApi.remove(project.id);
      onDeleted();
    } catch (err) {
      setError(err.message || "Couldn't delete this project.");
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Delete project</h2>
          </div>
          <button onClick={onClose} disabled={deleting} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          This permanently deletes <span className="font-semibold text-slate-900 dark:text-white">{project.name}</span>. This
          can't be undone.
        </p>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex gap-2">
          <Button type="button" onClick={handleConfirm} disabled={deleting} className="flex-1 bg-red-600 text-white shadow-sm hover:bg-red-700">
            {deleting ? "Deleting…" : "Delete project"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{project.name}</p>
          {project.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{project.description}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={() => onEdit(project)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-500">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(project)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={project.status} />
        <ImportanceBadge importance={project.importance} />
      </div>

      <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <CalendarClock className="h-3.5 w-3.5" />
          Ends {formatDateShort(project.endDate)}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {project.teamMembers?.length || 0} team member{project.teamMembers?.length === 1 ? "" : "s"}
          {project.projectManager && <span> · PM: {project.projectManager.name}</span>}
        </div>
      </div>
    </Card>
  );
}

export default function ProjectManagement() {
  const [projects, setProjects] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function loadProjects() {
    projectsApi
      .getAll()
      .then(setProjects)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadProjects();
    employeeProfileApi.getAll().then(setEmployees).catch(() => {});
  }, []);

  if (error) {
    return <PageError message={`Couldn't load projects: ${error}`} onRetry={loadProjects} />;
  }
  if (!projects) {
    return <PageLoading label="Loading projects…" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopBar />

        <main className="flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Project Management
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create projects, assign teams, and track progress.</p>
            </div>
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No projects yet. Click "Add Project" to create the first one.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onEdit={setEditTarget} onDelete={setDeleteTarget} />
              ))}
            </div>
          )}
        </main>
      </div>

      {showForm && (
        <ProjectFormModal
          employees={employees}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadProjects();
          }}
        />
      )}

      {editTarget && (
        <ProjectFormModal
          project={editTarget}
          employees={employees}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            loadProjects();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteProjectModal
          project={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            loadProjects();
          }}
        />
      )}
    </div>
  );
}
