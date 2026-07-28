import { HolidayModel } from "../db/schemas.js";

export let holidays = [];

export async function loadHolidays() {
  let docs = await HolidayModel.find().sort({ date: 1 }).lean();
  holidays.length = 0;
  holidays.push(...docs.map(({ _id, ...rest }) => rest));
  return holidays;
}
