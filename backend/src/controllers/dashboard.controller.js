import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as dashboardService from "../services/dashboard.service.js";

export const getOverview = asyncHandler(async (req, res) => {
  const overview = await dashboardService.getOverview(req.user?.name);
  return res.status(200).json(new ApiResponse(200, overview));
});

export const getSnapshot = asyncHandler(async (req, res) => {
  const snapshot = await dashboardService.getSnapshot();
  return res.status(200).json(new ApiResponse(200, { snapshot }));
});

export const getMetrics = asyncHandler(async (req, res) => {
  const metrics = await dashboardService.getMetrics();
  return res.status(200).json(new ApiResponse(200, { metrics }));
});

export const getLiveWorkforce = asyncHandler(async (req, res) => {
  const workforce = await dashboardService.getLiveWorkforce(Number(req.query.limit) || 10);
  return res.status(200).json(new ApiResponse(200, { workforce }));
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const activity = await dashboardService.getRecentActivity(Number(req.query.limit) || 10);
  return res.status(200).json(new ApiResponse(200, { activity }));
});
