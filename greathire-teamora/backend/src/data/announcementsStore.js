import { AnnouncementModel } from "../db/schemas.js";

export let announcements = [];

export async function loadAnnouncements() {
  let docs = await AnnouncementModel.find().sort({ postedOn: -1 }).lean();
  announcements.length = 0;
  announcements.push(...docs.map(({ _id, ...rest }) => rest));
  return announcements;
}
