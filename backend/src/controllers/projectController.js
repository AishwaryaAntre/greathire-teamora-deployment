import { Project } from "../models/Project.js";
import { ApiError } from "../middleware/errorHandler.js";

export let projectController = {
  // GET /api/projects?status=&importance=&search=
  // Admin sees every project; any other authenticated user sees only
  // projects where they're a team member or the project manager.
  list: (req, res) => {
    if (req.user?.role === "admin") {
      let { status, importance, search } = req.query;
      let data = Project.getAll({ status, importance, search });
      return res.json({ success: true, data });
    }

    if (!req.user?.employeeId) throw new ApiError(403, "No employee profile linked to this account");
    let data = Project.getByEmployeeId(req.user.employeeId);
    res.json({ success: true, data });
  },

  // GET /api/projects/:id
  getById: (req, res) => {
    let project = Project.getById(req.params.id);
    if (!project) throw new ApiError(404, "Project not found");

    let isAdmin = req.user?.role === "admin";
    let isOnProject =
      req.user?.employeeId &&
      (project.teamMemberIds.includes(req.user.employeeId) || project.projectManagerId === req.user.employeeId);

    if (!isAdmin && !isOnProject) throw new ApiError(404, "Project not found");
    res.json({ success: true, data: project });
  },

  // POST /api/projects  — admin only (enforced by route middleware).
  create: async (req, res) => {
    let project = await Project.create({ ...req.body, createdBy: req.user?.id || null });
    res.status(201).json({ success: true, data: project });
  },

  // PATCH /api/projects/:id  — full edit, admin only (enforced by route middleware).
  update: async (req, res) => {
    let project = await Project.update(req.params.id, req.body);
    if (!project) throw new ApiError(404, "Project not found");
    res.json({ success: true, data: project });
  },

  // PATCH /api/projects/:id/status  — status/progress only. Admin or the
  // project's assigned project manager may call this; anyone else is
  // rejected here since route middleware alone can't know who the PM is
  // (that's per-project data), unlike role-based admin routes.
  updateStatus: async (req, res) => {
    let isAdmin = req.user?.role === "admin";
    let isManager = req.user?.employeeId && Project.isProjectManager(req.params.id, req.user.employeeId);
    if (!isAdmin && !isManager) throw new ApiError(403, "Only an admin or the project manager can update status");

    let project = await Project.updateStatus(req.params.id, req.body.status);
    if (!project) throw new ApiError(404, "Project not found");
    res.json({ success: true, data: project });
  },

  // DELETE /api/projects/:id  — admin only (enforced by route middleware).
  remove: async (req, res) => {
    let deleted = await Project.delete(req.params.id);
    if (!deleted) throw new ApiError(404, "Project not found");
    res.json({ success: true, data: { id: req.params.id } });
  },
};
