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

/** Removes every leave request for a deleted employee — otherwise the
 * requests list and CSV export keep showing rows for someone who no longer
 * has an account. */
export async function deleteLeaveRequestsByEmployeeId(employeeId) {
  for (let i = leaveRequests.length - 1; i >= 0; i--) {
    if (leaveRequests[i].employeeId === employeeId) leaveRequests.splice(i, 1);
  }
  await LeaveRequestModel.deleteMany({ employeeId });
}

export let LEAVE_TYPE_OPTIONS = ["Annual", "Sick Leave", "Casual", "Unpaid"];
export let LEAVE_STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];
