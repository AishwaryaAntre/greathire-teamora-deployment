import {
  projects,
  persistNewProject,
  persistProjectUpdate,
  deleteProjectById,
  removeEmployeeFromProjects,
} from "../data/projectsStore.js";
import { Employee } from "./Employee.js";
import { generateId } from "../utils/id.js";
import { todayISO } from "../utils/dates.js";

/** Joins in the employee records for teamMemberIds and projectManagerId so
 * the frontend never has to do its own lookups — same convention as
 * LeaveRequest.js's withEmployee(). Filters out ids that no longer resolve
 * (e.g. a race with an in-flight employee deletion). */
function withEmployees(project) {
  let teamMembers = project.teamMemberIds
    .map((id) => Employee.getById(id))
    .filter(Boolean);
  let projectManager = project.projectManagerId ? Employee.getById(project.projectManagerId) : null;

  return { ...project, teamMembers, projectManager };
}

export let Project = {
  /** Full list — admin view. */
  getAll({ status, importance, search } = {}) {
    let rows = projects;

    if (status && status !== "All") {
      rows = rows.filter((p) => p.status === status);
    }
    if (importance && importance !== "All") {
      rows = rows.filter((p) => p.importance === importance);
    }
    if (search) {
      let q = search.toLowerCase();
      rows = rows.filter((p) => p.name.toLowerCase().includes(q));
    }

    return rows.map(withEmployees).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /** Employee view — only projects where the employee is a team member or
   * the project manager. */
  getByEmployeeId(employeeId) {
    return projects
      .filter((p) => p.teamMemberIds.includes(employeeId) || p.projectManagerId === employeeId)
      .map(withEmployees)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    let project = projects.find((p) => p.id === id);
    return project ? withEmployees(project) : null;
  },

  /** True if the given employee is the project manager for this project id.
   * Used by the controller to decide update permissions (admin OR PM). */
  isProjectManager(id, employeeId) {
    let project = projects.find((p) => p.id === id);
    return !!project && !!employeeId && project.projectManagerId === employeeId;
  },

  async create({ name, description, teamMemberIds, projectManagerId, endDate, importance, status, createdBy }) {
    let project = {
      id: generateId("proj"),
      name,
      description: description || "",
      teamMemberIds: Array.isArray(teamMemberIds) ? teamMemberIds : [],
      projectManagerId: projectManagerId || null,
      endDate,
      importance: importance || "Medium",
      status: status || "Active",
      createdBy: createdBy || null,
      createdAt: todayISO(),
    };
    await persistNewProject(project);
    return withEmployees(project);
  },

  /** Admin update — every editable field. */
  async update(id, updates = {}) {
    let project = projects.find((p) => p.id === id);
    if (!project) return null;

    let allowed = ["name", "description", "teamMemberIds", "projectManagerId", "endDate", "importance", "status"];
    for (let key of allowed) {
      if (updates[key] !== undefined) project[key] = updates[key];
    }
    await persistProjectUpdate(project);
    return withEmployees(project);
  },

  /** Project-manager update — restricted to status only (progress tracking),
   * per the requirement that only admin or the assigned PM can mark
   * completion, and PMs shouldn't be able to reassign the team via this. */
  async updateStatus(id, status) {
    let project = projects.find((p) => p.id === id);
    if (!project) return null;
    project.status = status;
    await persistProjectUpdate(project);
    return withEmployees(project);
  },

  async delete(id) {
    return deleteProjectById(id);
  },

  /** Admin-only cleanup for a deleted employee: strips them out of every
   * project's team list / PM slot rather than leaving a dangling id. */
  async removeEmployeeEverywhere(employeeId) {
    return removeEmployeeFromProjects(employeeId);
  },

  /** Backs the Reports & Analytics "Completed vs Not Completed" chart. */
  getCompletionStats() {
    let counts = { Active: 0, Working: 0, Completed: 0, "On Hold": 0, Cancelled: 0 };
    for (let p of projects) {
      if (counts[p.status] === undefined) counts[p.status] = 0;
      counts[p.status] += 1;
    }
    let total = projects.length;
    let completed = counts.Completed || 0;
    return {
      total,
      completed,
      notCompleted: total - completed,
      byStatus: Object.entries(counts).map(([status, value]) => ({ status, value })),
    };
  },
};
