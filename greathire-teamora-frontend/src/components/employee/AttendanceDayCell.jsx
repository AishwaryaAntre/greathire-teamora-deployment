import { cn } from "@/lib/utils";

const statusClasses = {
  present: "bg-emerald-50 text-emerald-700",
  absent: "bg-rose-50 text-rose-700",
  leave: "bg-blue-50 text-blue-700",
  late: "bg-amber-50 text-amber-700",
  weekend: "bg-rose-50/60 text-rose-400",
  muted: "text-muted-foreground/40",
  today: "bg-primary text-primary-foreground",
};

export default function AttendanceDayCell({ date, status }) {
  return (
    <div
      className={cn(
        "flex h-9 items-center justify-center rounded-lg text-sm font-medium",
        statusClasses[status] ?? "text-foreground"
      )}
    >
      {date}
    </div>
  );
}
