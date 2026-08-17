import { useEffect, useState } from "react";
import { Briefcase, Users, CalendarClock, ShieldCheck } from "lucide-react";
import MasterSidebar from "@/components/layout/MasterSidebar";
import EmployeeTopBar from "@/components/layout/EmployeeTopBar";
import { Card } from "@/components/ui/card";
import { projectsApi, PROJECT_STATUS_OPTIONS } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";
import PageLoading from "@/components/routing/PageLoading";
import PageError from "@/components/routing/PageError";
import { StatusBadge, ImportanceBadge, formatDateShort } from "@/lib/projectDisplay";

/** Inline status control shown only to the project's assigned project
 * manager — everyone else on the project sees a plain read-only badge.
 * Regular assigned employees never get this control, even disabled. */
function ManagerStatusControl({ project, onUpdated }) {
  const [status, setStatus] = useState(project.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e) {
    let next = e.target.value;
    setStatus(next);
    setSaving(true);
    setError("");
    try {
      let updated = await projectsApi.updateStatus(project.id, next);
      onUpdated(updated);
    } catch (err) {
      setStatus(project.status);
      setError(err.message || "Couldn't update status.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
        You're the project manager — update status
      </label>
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white disabled:opacity-60"
      >
        {PROJECT_STATUS_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function ProjectCard({ project, isManager, onUpdated }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{project.name}</p>
        {project.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{project.description}</p>
        )}
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
          <ShieldCheck className="h-3.5 w-3.5" />
          Project manager: {project.projectManager?.name || "Unassigned"}
        </div>
      </div>

      <div>
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          <Users className="h-3.5 w-3.5" />
          Team members
        </p>
        <div className="flex flex-wrap gap-1.5">
          {(project.teamMembers || []).map((member) => (
            <span
              key={member.id}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs text-slate-600 dark:text-slate-300"
            >
              {member.name}
            </span>
          ))}
          {(!project.teamMembers || project.teamMembers.length === 0) && (
            <span className="text-xs text-slate-400 dark:text-slate-500">No other team members.</span>
          )}
        </div>
      </div>

      {isManager && <ManagerStatusControl project={project} onUpdated={onUpdated} />}
    </Card>
  );
}

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState("");

  function loadProjects() {
    projectsApi
      .getAll()
      .then(setProjects)
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleUpdated(updated) {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  if (error) {
    return <PageError message={`Couldn't load your projects: ${error}`} onRetry={loadProjects} />;
  }
  if (!projects) {
    return <PageLoading label="Loading your projects…" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background dark:bg-slate-950">
      <MasterSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <EmployeeTopBar user={user} />

        <main className="flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              My Projects
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Projects you're assigned to, and who else is working on them.
            </p>
          </div>

          {projects.length === 0 ? (
            <Card className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              You're not assigned to any projects yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isManager={project.projectManager?.id === user?.employeeId}
                  onUpdated={handleUpdated}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
