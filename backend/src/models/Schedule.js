import {
  scheduleItems,
  persistNewScheduleItem,
  persistScheduleItemUpdate,
  deleteScheduleItemById,
  deleteScheduleItemsByEmployeeId,
  SCHEDULE_TYPE_OPTIONS,
  SCHEDULE_STATUS_OPTIONS,
} from "../data/scheduleStore.js";
import { Employee } from "./Employee.js";
import { Project } from "./Project.js";
import { generateId } from "../utils/id.js";
import { addDays, daysInMonth, isWeekend, toISODate, todayISO } from "../utils/dates.js";

function withRelations(item) {
  let employee = Employee.getById(item.employeeId);
  let project = item.projectId ? Project.getById(item.projectId) : null;
  let participants = (item.participantIds || [])
    .map((id) => Employee.getById(id))
    .filter(Boolean);

  return {
    ...item,
    employee: employee ? { id: employee.id, name: employee.name, initials: employee.initials, avatar: employee.avatar } : null,
    project: project ? { id: project.id, name: project.name } : null,
    participants,
  };
}

function belongsToEmployee(item, employeeId) {
  return item.employeeId === employeeId || (item.participantIds || []).includes(employeeId);
}

export let Schedule = {
  getById(id) {
    let item = scheduleItems.find((s) => s.id === id);
    return item ? withRelations(item) : null;
  },

  listForEmployee(employeeId, { startDate, endDate } = {}) {
    return scheduleItems
      .filter((item) => {
        if (!belongsToEmployee(item, employeeId)) return false;
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
        return item.status !== "cancelled";
      })
      .map(withRelations)
      .sort((a, b) => {
        let dateCmp = a.date.localeCompare(b.date);
        if (dateCmp !== 0) return dateCmp;
        return (a.startTime || "").localeCompare(b.startTime || "");
      });
  },

  getMonth(employeeId, year, month) {
    let now = new Date();
    let y = year ?? now.getFullYear();
    let m = month ?? now.getMonth();
    let first = new Date(y, m, 1);
    let totalDays = daysInMonth(first);
    let today = todayISO();
    let monthStart = toISODate(first);
    let monthEnd = toISODate(new Date(y, m, totalDays));

    let eventsByDate = new Map();
    for (let item of this.listForEmployee(employeeId, { startDate: monthStart, endDate: monthEnd })) {
      if (!eventsByDate.has(item.date)) eventsByDate.set(item.date, []);
      eventsByDate.get(item.date).push({
        id: item.id,
        type: item.type,
        title: item.title,
        startTime: item.startTime || null,
        endTime: item.endTime || null,
        status: item.status,
      });
    }

    let leadIn = (first.getDay() + 6) % 7;
    let cells = [];

    for (let i = leadIn; i > 0; i -= 1) {
      let d = addDays(first, -i);
      cells.push({ date: d.getDate(), dateISO: toISODate(d), inMonth: false, isToday: false, events: [] });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      let date = new Date(y, m, day);
      let dateISO = toISODate(date);
      cells.push({
        date: day,
        dateISO,
        inMonth: true,
        isToday: dateISO === today,
        isWeekend: isWeekend(date),
        events: eventsByDate.get(dateISO) || [],
      });
    }

    let trail = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
    for (let i = 1; i <= trail; i += 1) {
      let d = addDays(new Date(y, m, totalDays), i);
      cells.push({ date: d.getDate(), dateISO: toISODate(d), inMonth: false, isToday: false, events: [] });
    }

    let weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return {
      label: first.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      weeks,
      legend: [
        { id: "task", label: "Task", color: "bg-violet-500" },
        { id: "meeting", label: "Meeting", color: "bg-sky-500" },
      ],
    };
  },

  async create({
    employeeId,
    type,
    title,
    description,
    date,
    startTime,
    endTime,
    location,
    participantIds,
    projectId,
    createdBy,
  }) {
    if (!SCHEDULE_TYPE_OPTIONS.includes(type)) throw new Error("Invalid schedule type");

    let item = {
      id: generateId("sch"),
      employeeId,
      type,
      title,
      description: description || "",
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      location: location || "",
      participantIds: Array.isArray(participantIds) ? participantIds : [],
      projectId: projectId || null,
      status: "scheduled",
      createdBy: createdBy || null,
      createdAt: todayISO(),
    };

    await persistNewScheduleItem(item);
    return withRelations(item);
  },

  async update(id, updates = {}) {
    let item = scheduleItems.find((s) => s.id === id);
    if (!item) return null;

    let allowed = [
      "type",
      "title",
      "description",
      "date",
      "startTime",
      "endTime",
      "location",
      "participantIds",
      "projectId",
      "status",
    ];
    for (let key of allowed) {
      if (updates[key] !== undefined) item[key] = updates[key];
    }

    await persistScheduleItemUpdate(item);
    return withRelations(item);
  },

  async delete(id) {
    return deleteScheduleItemById(id);
  },

  async deleteAllForEmployee(employeeId) {
    return deleteScheduleItemsByEmployeeId(employeeId);
  },
};

export { SCHEDULE_TYPE_OPTIONS, SCHEDULE_STATUS_OPTIONS };
