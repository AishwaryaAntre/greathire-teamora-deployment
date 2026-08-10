import { employees, departments, persistEmployeeUpdate, createEmployee, deleteEmployee, adjustLeaveAccrual } from "../data/employees.js";
import { addEmployeeToDefaultChannels, removeEmployeeFromAllChannels } from "../data/messagesStore.js";

const SELF_EDITABLE_FIELDS = ["name", "email", "phone", "avatar"];
const ADMIN_EDITABLE_FIELDS = ["name", "email", "phone", "avatar", "role", "department", "employeeCode"];

export let Employee = {
  getAll(department) {
    if (!department || department === "All Departments") return employees;
    return employees.filter((e) => e.department === department);
  },

  getById(id) {
    return employees.find((e) => e.id === id) || null;
  },

  listDepartments() {
    return departments;
  },

  /** Self-service update — restricted to a handful of safe fields. */
  async update(id, updates = {}) {
    return persistEmployeeUpdate(id, updates, SELF_EDITABLE_FIELDS);
  },

  /** Admin update — allowed to touch every editable field. */
  async updateAsAdmin(id, updates = {}) {
    return persistEmployeeUpdate(id, updates, ADMIN_EDITABLE_FIELDS);
  },

  /** Admin-only: create a new employee record. Auto-enrolls them into every
   * default message channel (e.g. "General") so they land with messaging
   * access instead of needing to be added by hand afterward. */
  async create(fields) {
    let employee = await createEmployee(fields);
    await addEmployeeToDefaultChannels(employee.id);
    return employee;
  },

  /** Admin-only: permanently remove an employee record. Returns false if no
   * such employee exists. Also drops them from every channel's member list.
   * Callers are responsible for cleaning up other related data (attendance,
   * leave requests, login account) — see employeeProfileController.deleteEmployee
   * for the full cascade. */
  async remove(id) {
    await removeEmployeeFromAllChannels(id);
    return deleteEmployee(id);
  },

  /** Adjusts the running leave-accrual total (+/-) used to nudge leave balance
   * from attendance events. See data/employees.js#adjustLeaveAccrual. */
  async adjustLeaveAccrual(id, delta) {
    return adjustLeaveAccrual(id, delta);
  },
};
