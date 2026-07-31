import { LeaveRequestModel } from "../db/schemas.js";

export let leaveRequests = [];

export async function loadLeaveRequests() {
  let docs = await LeaveRequestModel.find().lean();
  leaveRequests.length = 0;
  leaveRequests.push(...docs.map(({ _id, ...rest }) => rest));
  return leaveRequests;
}

export async function persistNewLeaveRequest(request) {
  leaveRequests.unshift(request);
  await LeaveRequestModel.create(request);
  return request;
}

export async function persistLeaveRequestUpdate(request) {
  let { id, ...rest } = request;
  await LeaveRequestModel.updateOne({ id }, { $set: rest });
  return request;
}

export let LEAVE_TYPE_OPTIONS = ["Annual", "Sick Leave", "Casual", "Unpaid"];
export let LEAVE_STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];
