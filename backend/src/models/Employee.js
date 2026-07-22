import { employees, departments } from "../data/employees.js";

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

  /** Allows editing a handful of self-service-safe fields (name, email, phone, avatar). */
  update(id, updates = {}) {
    let employee = employees.find((e) => e.id === id);
    if (!employee) return null;

    let allowed = ["name", "email", "phone", "avatar"];
    for (let key of allowed) {
      if (updates[key] !== undefined) employee[key] = updates[key];
    }
    return employee;
  },
};
