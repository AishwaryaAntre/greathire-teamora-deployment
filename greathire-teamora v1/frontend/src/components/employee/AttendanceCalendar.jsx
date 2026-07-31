import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AttendanceDayCell from "@/components/employee/AttendanceDayCell";
import AttendanceLegend from "@/components/employee/AttendanceLegend";
import { attendanceLegend } from "@/data/employeeDashboardData";

export default function AttendanceCalendar({ month, onPrevMonth, onNextMonth }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Calendar</CardTitle>
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
              {week.map((day, j) => (
                <AttendanceDayCell key={j} date={day.date} status={day.status} />
              ))}
            </div>
          ))}
        </div>

        <AttendanceLegend items={attendanceLegend} />
      </CardContent>
    </Card>
  );
}
