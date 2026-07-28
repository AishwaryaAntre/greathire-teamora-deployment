import { employees, departments, persistEmployeeUpdate } from "../data/employees.js";

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

  /** Allows editing a handful of self-service-safe fields (name, email, phone, avatar).
   * Persists to MongoDB via the data layer. */
  async update(id, updates = {}) {
    return persistEmployeeUpdate(id, updates);
  },
};
