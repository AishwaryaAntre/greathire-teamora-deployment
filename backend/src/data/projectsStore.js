import { ProjectModel } from "../db/schemas.js";

export let projects = [];

export async function loadProjects() {
  let docs = await ProjectModel.find().lean();
  projects.length = 0;
  projects.push(...docs.map(({ _id, ...rest }) => rest));
  return projects;
}

export async function persistNewProject(project) {
  projects.unshift(project);
  await ProjectModel.create(project);
  return project;
}

export async function persistProjectUpdate(project) {
  let { id, ...rest } = project;
  await ProjectModel.updateOne({ id }, { $set: rest });
  return project;
}

export async function deleteProjectById(id) {
  let index = projects.findIndex((p) => p.id === id);
  if (index === -1) return false;
  projects.splice(index, 1);
  await ProjectModel.deleteOne({ id });
  return true;
}

/** Cleanup hook for employee deletion: drops the employee from every
 * project's team-member list and unsets them as project manager where
 * applicable, instead of leaving dangling references — mirrors
 * leaveStore.js#deleteLeaveRequestsByEmployeeId's cleanup-on-delete pattern,
 * except projects themselves are kept (only the employee reference is
 * removed) since a project can still exist with other team members. */
export async function removeEmployeeFromProjects(employeeId) {
  let touched = [];
  for (let project of projects) {
    let wasMember = project.teamMemberIds.includes(employeeId);
    let wasManager = project.projectManagerId === employeeId;
    if (!wasMember && !wasManager) continue;

    if (wasMember) {
      project.teamMemberIds = project.teamMemberIds.filter((id) => id !== employeeId);
    }
    if (wasManager) {
      project.projectManagerId = null;
    }
    touched.push(project);
  }

  for (let project of touched) {
    await ProjectModel.updateOne(
      { id: project.id },
      { $set: { teamMemberIds: project.teamMemberIds, projectManagerId: project.projectManagerId } }
    );
  }

  return touched;
}

export let PROJECT_IMPORTANCE_OPTIONS = ["Low", "Medium", "High"];
export let PROJECT_STATUS_OPTIONS = ["Active", "Working", "Completed", "On Hold", "Cancelled"];
