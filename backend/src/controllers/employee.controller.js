import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as employeeService from "../services/employee.service.js";

export const listEmployees = asyncHandler(async (req, res) => {
  const { data, meta } = await employeeService.listEmployees(req.query);
  return res.status(200).json(new ApiResponse(200, { employees: data, meta }));
});

export const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { employee }));
});

export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  return res.status(201).json(new ApiResponse(201, { employee: employee.toSafeJSON() }, "Employee created"));
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, { employee: employee.toSafeJSON() }, "Employee updated"));
});

export const updateEmployeeStatus = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployeeStatus(req.params.id, req.body.status);
  return res.status(200).json(new ApiResponse(200, { employee: employee.toSafeJSON() }, "Status updated"));
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  return res.status(200).json(new ApiResponse(200, null, "Employee removed"));
});

export const getQuickStats = asyncHandler(async (req, res) => {
  const stats = await employeeService.getQuickStats();
  return res.status(200).json(new ApiResponse(200, { stats }));
});

export const listDepartments = asyncHandler(async (req, res) => {
  const departments = await employeeService.listDepartments();
  return res.status(200).json(new ApiResponse(200, { departments }));
});
