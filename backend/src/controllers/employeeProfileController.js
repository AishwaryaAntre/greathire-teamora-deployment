import { EmployeeProfile } from "../models/EmployeeProfile.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";
import { ApiError } from "../middleware/errorHandler.js";

// Profile pages are usually navigated to with a specific :id (e.g. from a directory list),
// but default to the self-service employee so `/api/employees/profile` also works standalone.
function resolveEmployeeId(req) {
  return req.params.id || CURRENT_EMPLOYEE_ID;
}

export let employeeProfileController = {
  getProfile: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let profile = EmployeeProfile.getProfile(employeeId);
    if (!profile) throw new ApiError(404, "Unknown employeeId");
    res.json({ success: true, data: profile });
  },
  getStatCards: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getStatCards(resolveEmployeeId(req)) });
  },
  getWorkSummary: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getWorkSummary(resolveEmployeeId(req)) });
  },
  getActivityMap: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getActivityMap(resolveEmployeeId(req)) });
  },
  getPersonalInfo: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getPersonalInfo(resolveEmployeeId(req)) });
  },
  updatePersonalInfo: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let data = EmployeeProfile.updatePersonalInfo(employeeId, req.body || {});
    if (!data) throw new ApiError(404, "Unknown employeeId");
    res.json({ success: true, data });
  },
  getDocuments: (req, res) => {
    res.json({ success: true, data: EmployeeProfile.getDocuments(resolveEmployeeId(req)) });
  },

  // GET /api/employees/:id/profile — everything EmployeeProfilePage.jsx needs in one call.
  getBundle: (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let profile = EmployeeProfile.getProfile(employeeId);
    if (!profile) throw new ApiError(404, "Unknown employeeId");
    res.json({ success: true, data: EmployeeProfile.getBundle(employeeId) });
  },
};
