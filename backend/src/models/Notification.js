import { notifications, getPreferencesFor } from "../data/notificationsStore.js";
import { generateId } from "../utils/id.js";
import { CURRENT_EMPLOYEE_ID } from "../data/employees.js";

function timeAgo(iso) {
  let diffMs = Date.now() - new Date(iso).getTime();
  let minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  let hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  let days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function badgeForPriority(priority) {
  if (priority === "high") return { label: "High", tone: "bg-red-50 text-red-600" };
  if (priority === "medium") return { label: "Medium", tone: "bg-amber-50 text-amber-600" };
  return { label: "Low", tone: "bg-slate-100 text-slate-500" };
}

function toDto(n) {
  return {
    id: n.id,
    title: n.title,
    description: n.description,
    category: n.category,
    priority: n.priority,
    time: timeAgo(n.createdAt),
    createdAt: n.createdAt,
    avatar: n.avatar,
    isSystem: n.isSystem,
    unread: !n.read,
    badge: badgeForPriority(n.priority),
  };
}

export let Notification = {
  /** filter: "all" | "unread" | "attendance" | "leave" | "system"; search matches title/description. */
  list(employeeId = CURRENT_EMPLOYEE_ID, { filter = "all", search = "" } = {}) {
    let rows = notifications.filter((n) => n.recipientEmployeeId === employeeId);

    if (filter === "unread") rows = rows.filter((n) => !n.read);
    else if (filter !== "all") rows = rows.filter((n) => n.category === filter);

    if (search) {
      let q = search.toLowerCase();
      rows = rows.filter(
        (n) => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q)
      );
    }

    return rows
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(toDto);
  },

  getSummary(employeeId = CURRENT_EMPLOYEE_ID) {
    let rows = notifications.filter((n) => n.recipientEmployeeId === employeeId);
    let unread = rows.filter((n) => !n.read).length;
    let highPriority = rows.filter((n) => n.priority === "high" && !n.read).length;
    return [
      { label: "Unread", value: String(unread), tone: "text-blue-600" },
      { label: "High Priority", value: String(highPriority), tone: "text-red-500" },
    ];
  },

  getPreferences(employeeId = CURRENT_EMPLOYEE_ID) {
    return getPreferencesFor(employeeId);
  },

  updatePreferences(employeeId = CURRENT_EMPLOYEE_ID, updates = {}) {
    let prefs = getPreferencesFor(employeeId);
    Object.assign(prefs, updates);
    return prefs;
  },

  create({ title, description, category = "system", priority = "low", recipientEmployeeId = CURRENT_EMPLOYEE_ID, isSystem = false, relatedEmployeeId = null, avatar = null }) {
    let notif = {
      id: generateId("notif"),
      type: category,
      category,
      title,
      description,
      priority,
      read: false,
      isSystem,
      relatedEmployeeId,
      avatar,
      createdAt: new Date().toISOString(),
      recipientEmployeeId,
    };
    notifications.unshift(notif);
    return toDto(notif);
  },

  markAsRead(id, employeeId = CURRENT_EMPLOYEE_ID) {
    let notif = notifications.find((n) => n.id === id && n.recipientEmployeeId === employeeId);
    if (!notif) return null;
    notif.read = true;
    return toDto(notif);
  },

  markAllAsRead(employeeId = CURRENT_EMPLOYEE_ID) {
    let rows = notifications.filter((n) => n.recipientEmployeeId === employeeId);
    rows.forEach((n) => (n.read = true));
    return rows.length;
  },
};
