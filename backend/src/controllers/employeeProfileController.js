import { EmployeeProfile } from "../models/EmployeeProfile.js";
import { Employee } from "../models/Employee.js";
import { Attendance } from "../models/Attendance.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { Project } from "../models/Project.js";
import { Schedule } from "../models/Schedule.js";
import { CURRENT_EMPLOYEE_ID, employees } from "../data/employees.js";
import { UsersStore } from "../data/usersStore.js";
import { hashPassword } from "../utils/password.js";
import { ApiError } from "../middleware/errorHandler.js";

// Profile pages are usually navigated to with a specific :id (e.g. from a directory list),
// but default to the caller's own linked employee so `/api/employees/profile` also works standalone.
function resolveEmployeeId(req) {
  return req.params.id || req.user?.employeeId || CURRENT_EMPLOYEE_ID;
}

function isAdmin(req) {
  return req.user?.role === "admin";
}

export let employeeProfileController = {
  // GET /api/employees — directory list (powers the "Employees" nav item / EmployeesListPage.jsx).
  listAll: (req, res) => {
    let data = employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      department: e.department,
      initials: e.initials,
      avatar: e.avatar,
      email: e.email,
      employeeCode: e.employeeCode,
    }));
    res.json({ success: true, data });
  },

  // POST /api/employees — admin-only. Creates the employee record and their login.
  createEmployee: async (req, res) => {
    let { name, email, password, role, department, phone } = req.body;
    if (await UsersStore.findByEmail(email)) throw new ApiError(409, "An account with this email already exists");

    let employee = await Employee.create({ name, email, department, phone, role: role === "admin" ? "Admin" : "Employee" });
    let passwordHash = await hashPassword(password);
    let user = await UsersStore.create({ name, email, passwordHash, employeeId: employee.id, role });

    res.status(201).json({ success: true, data: { employee, user: { id: user.id, email: user.email, role: user.role } } });
  },

  // DELETE /api/employees/:id — admin-only. Removes the employee record, their
  // login account, and their attendance/leave history (both of those join
  // back to the employee by id and would otherwise show blank rows, or in
  // Attendance's case, throw — see Attendance.js's withEmployee()).
  deleteEmployee: async (req, res) => {
    let { id } = req.params;
    if (id === req.user?.employeeId) {
      throw new ApiError(400, "You can't delete your own account.");
    }
    let employee = Employee.getById(id);
    if (!employee) throw new ApiError(404, "Unknown employeeId");

    await Promise.all([
      Attendance.deleteAllForEmployee(id),
      LeaveRequest.deleteAllForEmployee(id),
      Schedule.deleteAllForEmployee(id),
      UsersStore.deleteByEmployeeId(id),
      Project.removeEmployeeEverywhere(id),
    ]);
    await Employee.remove(id);

    res.json({ success: true, data: { id } });
  },

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
  // PUT /api/employees/profile/personal-info (self) or /:id/profile/personal-info (admin editing someone else).
  updatePersonalInfo: async (req, res) => {
    let employeeId = resolveEmployeeId(req);
    let editingSelf = employeeId === (req.user?.employeeId || CURRENT_EMPLOYEE_ID);
    if (!editingSelf && !isAdmin(req)) {
      throw new ApiError(403, "Only an admin can edit another employee's profile");
    }
    let data = await EmployeeProfile.updatePersonalInfo(employeeId, req.body, isAdmin(req));
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
