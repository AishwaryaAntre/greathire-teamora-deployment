import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as attendanceService from "../services/attendance.service.js";

export const listAttendance = asyncHandler(async (req, res) => {
  const { data, meta } = await attendanceService.listAttendance(req.query);
  return res.status(200).json(new ApiResponse(200, { records: data, meta }));
});

export const getStatsCards = asyncHandler(async (req, res) => {
  const stats = await attendanceService.getStatsCards(req.query.date);
  return res.status(200).json(new ApiResponse(200, { stats }));
});

export const checkIn = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkIn(req.body.employeeId);
  return res.status(200).json(new ApiResponse(200, { record: record.toSafeJSON() }, "Checked in"));
});

export const checkOut = asyncHandler(async (req, res) => {
  const record = await attendanceService.checkOut(req.body.employeeId);
  return res.status(200).json(new ApiResponse(200, { record: record.toSafeJSON() }, "Checked out"));
});

export const startBreak = asyncHandler(async (req, res) => {
  const record = await attendanceService.startBreak(req.body.employeeId);
  return res.status(200).json(new ApiResponse(200, { record: record.toSafeJSON() }, "Break started"));
});

export const endBreak = asyncHandler(async (req, res) => {
  const record = await attendanceService.endBreak(req.body.employeeId);
  return res.status(200).json(new ApiResponse(200, { record: record.toSafeJSON() }, "Break ended"));
});

export const updateAttendanceStatus = asyncHandler(async (req, res) => {
  const record = await attendanceService.updateAttendanceRecordStatus(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, { record: record.toSafeJSON() }, "Record updated"));
});
