import { employees, departments } from "../data/employees.js";

export const Employee = {
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
};
