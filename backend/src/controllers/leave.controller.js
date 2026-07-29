import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as leaveService from "../services/leave.service.js";

export const listLeaveRequests = asyncHandler(async (req, res) => {
  const { data, meta } = await leaveService.listLeaveRequests(req.query);
  return res.status(200).json(new ApiResponse(200, { requests: data, meta }));
});

export const getLeaveRequest = asyncHandler(async (req, res) => {
  const request = await leaveService.getLeaveById(req.params.id);
  return res.status(200).json(new ApiResponse(200, { request }));
});

export const createLeaveRequest = asyncHandler(async (req, res) => {
  const request = await leaveService.createLeaveRequest(req.body);
  return res.status(201).json(new ApiResponse(201, { request }, "Leave request submitted"));
});

export const decideLeaveRequest = asyncHandler(async (req, res) => {
  const request = await leaveService.decideLeaveRequest(req.params.id, {
    ...req.body,
    decidedBy: req.user?._id,
  });
  return res.status(200).json(new ApiResponse(200, { request }, `Leave request ${req.body.status}`));
});

export const getStatsCards = asyncHandler(async (req, res) => {
  const stats = await leaveService.getStatsCards();
  return res.status(200).json(new ApiResponse(200, { stats }));
});

export const getTeamAvailability = asyncHandler(async (req, res) => {
  const availability = await leaveService.getTeamAvailability();
  return res.status(200).json(new ApiResponse(200, { availability }));
});

export const approveAllPending = asyncHandler(async (req, res) => {
  const requests = await leaveService.approveAllPending(req.user?._id);
  return res.status(200).json(new ApiResponse(200, { requests }, `${requests.length} requests approved`));
});
