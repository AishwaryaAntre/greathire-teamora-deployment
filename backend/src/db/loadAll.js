import { loadEmployees } from "../data/employees.js";
import { loadAttendance } from "../data/attendanceStore.js";
import { loadActivity } from "../data/activityStore.js";
import { loadLeaveRequests } from "../data/leaveStore.js";
import { loadNotifications, loadNotificationPreferences } from "../data/notificationsStore.js";
import { loadMessaging } from "../data/messagesStore.js";
import { loadGeneratedReports } from "../data/reportsStore.js";
import { loadHolidays } from "../data/holidaysStore.js";
import { loadAnnouncements } from "../data/announcementsStore.js";

/** Hydrates every module-level cache from MongoDB. Employees must load first —
 * everything else joins against it. Call once at boot, after seeding. */
export async function loadAllData() {
  await loadEmployees();
  await Promise.all([
    loadAttendance(),
    loadActivity(),
    loadLeaveRequests(),
    loadNotifications(),
    loadNotificationPreferences(),
    loadMessaging(),
    loadGeneratedReports(),
    loadHolidays(),
    loadAnnouncements(),
  ]);
  console.log("[db] all collections loaded into memory cache");
}
