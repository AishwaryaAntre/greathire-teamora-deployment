import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as reportService from "../services/report.service.js";

export const getStatsCards = asyncHandler(async (req, res) => {
  const { range, department } = req.query;
  const stats = await reportService.getStatsCards(range, department);
  return res.status(200).json(new ApiResponse(200, { stats }));
});

export const getAttendanceTrends = asyncHandler(async (req, res) => {
  const { range, department } = req.query;
  const trends = await reportService.getAttendanceTrends(range, department);
  return res.status(200).json(new ApiResponse(200, { trends }));
});

export const getWorkingHoursTrend = asyncHandler(async (req, res) => {
  const { range, department } = req.query;
  const trend = await reportService.getWorkingHoursTrend(range, department);
  return res.status(200).json(new ApiResponse(200, trend));
});

export const listDepartments = asyncHandler(async (req, res) => {
  const departments = await reportService.listDepartments();
  return res.status(200).json(new ApiResponse(200, { departments }));
});
