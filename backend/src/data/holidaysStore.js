// Static company holiday calendar. Dates are relative offsets from server start
// so the seed always shows sensible "upcoming" holidays regardless of when it's run.
import { addDays, toISODate } from "../utils/dates.js";

let seedOffsets = [
  { offsetDays: 14, name: "Founders' Day", type: "National Holiday" },
  { offsetDays: 40, name: "Harvest Festival", type: "Regional Holiday" },
  { offsetDays: 75, name: "Winter Break", type: "National Holiday" },
  { offsetDays: -20, name: "Spring Festival", type: "Regional Holiday" }, // already past, kept for history
];

let today = new Date();

export let holidays = seedOffsets.map(({ offsetDays, name, type }) => {
  let date = addDays(today, offsetDays);
  return {
    date: toISODate(date),
    name,
    type,
  };
});
