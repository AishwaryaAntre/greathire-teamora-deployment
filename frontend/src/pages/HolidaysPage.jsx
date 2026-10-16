import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HolidayItem from "@/components/employee/HolidayItem";
import EmployeeTopBar from "@/components/layout/EmployeeTopBar";
import MasterSidebar from "@/components/layout/MasterSidebar";
import PageError from "@/components/routing/PageError";
import PageLoading from "@/components/routing/PageLoading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { employeeDashboardApi } from "@/lib/api/employeeDashboard";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// These national and widely observed dates provide a useful calendar even
// before organization-specific holidays have been configured in the database.
const INDIA_HOLIDAYS_2026 = [
  { date: "2026-01-26", name: "Republic Day", type: "National holiday" },
  { date: "2026-03-04", name: "Holi", type: "Festival" },
  { date: "2026-08-15", name: "Independence Day", type: "National holiday" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "National holiday" },
  { date: "2026-10-17", name: "Maha Saptami", type: "Durga Puja" },
  { date: "2026-10-18", name: "Maha Ashtami", type: "Durga Puja" },
  { date: "2026-10-19", name: "Maha Navami", type: "Durga Puja" },
  { date: "2026-10-20", name: "Vijayadashami (Dussehra)", type: "Festival" },
  { date: "2026-11-08", name: "Diwali (Deepavali)", type: "Festival" },
  { date: "2026-11-24", name: "Guru Nanak Jayanti", type: "Festival" },
  { date: "2026-12-25", name: "Christmas Day", type: "National holiday" },
];

function dateParts(isoDate) {
  let [year, month, day] = isoDate.split("-").map(Number);
  return { year, month: month - 1, day };
}

function formatHoliday(holiday) {
  let { year, month, day } = dateParts(holiday.date);
  let date = new Date(year, month, day);
  return {
    ...holiday,
    id: holiday.id || `${holiday.date}-${holiday.name}`,
    day: String(day).padStart(2, "0"),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    meta: holiday.meta || `${date.toLocaleDateString("en-US", { weekday: "long" })} • ${holiday.type}`,
  };
}

function calendarDays(year, month) {
  let firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

export default function HolidaysPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [organizationHolidays, setOrganizationHolidays] = useState(null);
  const [error, setError] = useState("");
  const [monthCursor, setMonthCursor] = useState(() => {
    let today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  useEffect(() => {
    let cancelled = false;
    employeeDashboardApi
      .getUpcomingHolidays(50)
      .then((items) => !cancelled && setOrganizationHolidays(items))
      .catch((err) => !cancelled && setError(err.message));
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <PageError message={`Couldn't load upcoming holidays: ${error}`} onRetry={() => window.location.reload()} />;
  }
  if (!organizationHolidays) {
    return <PageLoading label="Loading upcoming holidays…" />;
  }

  let holidayByDate = new Map();
  [...INDIA_HOLIDAYS_2026, ...organizationHolidays]
    .filter((holiday) => holiday.date)
    .forEach((holiday) => {
      let formatted = formatHoliday(holiday);
      let events = holidayByDate.get(holiday.date) || [];
      if (!events.some((event) => event.name.toLowerCase() === formatted.name.toLowerCase())) {
        events.push(formatted);
      }
      holidayByDate.set(holiday.date, events);
    });

  let monthLabel = new Date(monthCursor.year, monthCursor.month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  let monthDates = calendarDays(monthCursor.year, monthCursor.month);
  let monthHolidays = [...holidayByDate.entries()]
    .filter(([date]) => {
      let parts = dateParts(date);
      return parts.year === monthCursor.year && parts.month === monthCursor.month;
    })
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .flatMap(([, events]) => events);
  let today = new Date();
  let todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex h-screen bg-background">
      <MasterSidebar />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <EmployeeTopBar user={user} />
        <main className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <div>
            <button
              type="button"
              onClick={() => navigate("/employee-dashboard")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-foreground">Upcoming Holidays</h1>
            <p className="mt-1 text-sm text-muted-foreground">Browse national holidays and major Indian festivals.</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  Holiday Calendar
                </CardTitle>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => setMonthCursor(({ year, month }) => {
                      let previous = new Date(year, month - 1);
                      return { year: previous.getFullYear(), month: previous.getMonth() };
                    })}
                    className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-32 text-center font-medium text-foreground">{monthLabel}</span>
                  <button
                    type="button"
                    onClick={() => setMonthCursor(({ year, month }) => {
                      let next = new Date(year, month + 1);
                      return { year: next.getFullYear(), month: next.getMonth() };
                    })}
                    className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground sm:gap-2">
                {WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
                {monthDates.map((day, index) => {
                  if (day === null) return <div key={`blank-${index}`} className="min-h-14 sm:min-h-20" />;
                  let date = `${monthCursor.year}-${String(monthCursor.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  let events = holidayByDate.get(date) || [];
                  return (
                    <div
                      key={date}
                      title={events.map((event) => event.name).join(", ") || undefined}
                      className={`min-h-14 rounded-lg border p-1 sm:min-h-20 sm:p-2 ${
                        date === todayISO ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <span className={`text-xs font-medium ${date === todayISO ? "text-primary" : "text-foreground"}`}>
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className="truncate rounded bg-blue-100 px-1 py-0.5 text-left text-[9px] font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 sm:text-[10px]"
                          >
                            {event.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h2 className="mt-6 border-t border-border pt-5 text-base font-semibold text-foreground">
                Holidays in {monthLabel}
              </h2>
              {monthHolidays.length ? (
                <div className="divide-y divide-border">
                  {monthHolidays.map((holiday) => (
                    <div key={holiday.id} className="py-4 first:pt-4 last:pb-0">
                      <HolidayItem {...holiday} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No holidays are listed for this month.
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
