import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { scheduleApi, SCHEDULE_TYPE_OPTIONS } from "@/lib/api/schedule";
import { employeeProfileApi } from "@/lib/api/employeeProfile";
import { projectsApi } from "@/lib/api/projects";
import { useAuth } from "@/lib/AuthContext";

/** Modal that lets an employee schedule a task or meeting on a specific
 * date. Used from the "My Projects" page (single source of truth for
 * creating schedule items — the copy that shows up on the calendar here
 * is the same one visible on the employee's profile page to teammates
 * and admins). */
export default function ScheduleFormModal({ open, onClose, defaultDate, onSaved }) {
  const { user } = useAuth();
  const [type, setType] = useState("task");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate || "");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [projectId, setProjectId] = useState("");
  const [participantIds, setParticipantIds] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError("");
    setType("task");
    setTitle("");
    setDescription("");
    setDate(defaultDate || "");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setProjectId("");
    setParticipantIds([]);

    employeeProfileApi
      .getAll()
      .then((all) => setEmployees((all || []).filter((e) => e.id !== user?.employeeId)))
      .catch(() => setEmployees([]));

    projectsApi
      .getAll()
      .then((all) => setProjects(all || []))
      .catch(() => setProjects([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultDate]);

  if (!open) return null;

  function toggleParticipant(id) {
    setParticipantIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !date) {
      setError("Please fill in a title and a date.");
      return;
    }
    if (type === "meeting" && !startTime) {
      setError("Meetings need a start time.");
      return;
    }
    if (startTime && endTime && endTime <= startTime) {
      setError("End time must be after start time.");
      return;
    }

    setSubmitting(true);
    try {
      await scheduleApi.create({
        type,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        location: location.trim() || undefined,
        projectId: projectId || undefined,
        participantIds: type === "meeting" ? participantIds : [],
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't schedule that. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-xl border border-transparent dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Schedule Task or Meeting</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sch-type">Type</Label>
            <select
              id="sch-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
            >
              {SCHEDULE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sch-title">Title</Label>
            <Input
              id="sch-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === "meeting" ? "e.g. Sprint planning" : "e.g. Finish onboarding checklist"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sch-date">Date</Label>
              <Input id="sch-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sch-location">Location (optional)</Label>
              <Input
                id="sch-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Room / link"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="sch-start">
                Start time{type === "meeting" ? "" : " (optional)"}
              </Label>
              <Input
                id="sch-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required={type === "meeting"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sch-end">End time (optional)</Label>
              <Input id="sch-end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {projects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="sch-project">Related project (optional)</Label>
              <select
                id="sch-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              >
                <option value="">None</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === "meeting" && employees.length > 0 && (
            <div className="space-y-2">
              <Label>Invite participants (optional)</Label>
              <div className="max-h-32 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700 p-2 space-y-1">
                {employees.map((emp) => (
                  <label
                    key={emp.id}
                    className="flex items-center gap-2 rounded px-2 py-1 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={participantIds.includes(emp.id)}
                      onChange={() => toggleParticipant(emp.id)}
                    />
                    {emp.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="sch-description">Description (optional)</Label>
            <textarea
              id="sch-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white"
              placeholder="Any extra notes"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Scheduling…" : "Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
