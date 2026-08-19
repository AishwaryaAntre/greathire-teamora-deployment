import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScheduleDayCell from "@/components/employee/ScheduleDayCell";
import ScheduleLegend from "@/components/employee/ScheduleLegend";

function formatTimeRange(startTime, endTime) {
  if (!startTime) return "";
  if (!endTime) return startTime;
  return `${startTime} – ${endTime}`;
}

export default function ScheduleCalendar({
  month,
  onPrevMonth,
  onNextMonth,
  onAddSchedule,
  onSelectDay,
  selectedDayISO,
  canEdit = false,
  title = "Schedule Calendar",
  subtitle,
}) {
  let selectedDay = selectedDayISO
    ? month.weeks.flat().find((day) => day.dateISO === selectedDayISO)
    : null;
  let selectedEvents = selectedDay?.events || [];

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {canEdit && onAddSchedule && (
            <Button size="sm" onClick={() => onAddSchedule(selectedDayISO)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Schedule task or meeting
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <button onClick={onPrevMonth} className="text-muted-foreground hover:text-foreground" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-medium text-foreground">{month.label}</span>
          <button onClick={onNextMonth} className="text-muted-foreground hover:text-foreground" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {month.weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-2 space-y-1">
          {month.weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-1">
              {week.map((day) => (
                <ScheduleDayCell
                  key={day.dateISO}
                  day={day}
                  selected={selectedDayISO === day.dateISO}
                  onSelect={(d) => onSelectDay?.(d.dateISO)}
                />
              ))}
            </div>
          ))}
        </div>

        <ScheduleLegend items={month.legend} />

        {selectedDayISO && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-900/50">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {new Date(selectedDayISO + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            {selectedEvents.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">No tasks or meetings scheduled.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {selectedEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm dark:bg-slate-900"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{event.title}</p>
                      <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                        {event.type}
                        {event.startTime ? ` · ${formatTimeRange(event.startTime, event.endTime)}` : ""}
                      </p>
                    </div>
                    <span
                      className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                        event.type === "meeting" ? "bg-sky-500" : "bg-violet-500"
                      }`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
