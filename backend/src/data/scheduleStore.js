import { ScheduleModel } from "../db/schemas.js";

export let scheduleItems = [];

export let SCHEDULE_TYPE_OPTIONS = ["task", "meeting"];
export let SCHEDULE_STATUS_OPTIONS = ["scheduled", "completed", "cancelled"];

export async function loadScheduleItems() {
  let docs = await ScheduleModel.find().lean();
  scheduleItems.length = 0;
  scheduleItems.push(...docs.map(({ _id, ...rest }) => rest));
  return scheduleItems;
}

export async function persistNewScheduleItem(item) {
  scheduleItems.unshift(item);
  await ScheduleModel.create(item);
  return item;
}

export async function persistScheduleItemUpdate(item) {
  let { id, ...rest } = item;
  await ScheduleModel.updateOne({ id }, { $set: rest });
  return item;
}

export async function deleteScheduleItemById(id) {
  let index = scheduleItems.findIndex((s) => s.id === id);
  if (index === -1) return false;
  scheduleItems.splice(index, 1);
  await ScheduleModel.deleteOne({ id });
  return true;
}

export async function deleteScheduleItemsByEmployeeId(employeeId) {
  let toRemove = scheduleItems.filter((s) => s.employeeId === employeeId || s.participantIds?.includes(employeeId));
  let remaining = scheduleItems.filter((s) => s.employeeId !== employeeId && !s.participantIds?.includes(employeeId));
  scheduleItems.splice(0, scheduleItems.length, ...remaining);
  await ScheduleModel.deleteMany({
    $or: [{ employeeId }, { participantIds: employeeId }],
  });
  return toRemove.length;
}
