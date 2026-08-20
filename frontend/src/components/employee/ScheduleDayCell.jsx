import { cn } from "@/lib/utils";

const typeDotClasses = {
  task: "bg-violet-500",
  meeting: "bg-sky-500",
};

export default function ScheduleDayCell({ day, selected, onSelect }) {
  let { date, inMonth, isToday, isWeekend, events = [] } = day;
  let hasEvents = events.length > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(day)}
      className={cn(
        "flex min-h-[4.5rem] flex-col rounded-lg border p-1.5 text-left transition-colors",
        !inMonth && "opacity-40",
        selected ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60",
        isToday && !selected && "ring-1 ring-blue-400",
        isWeekend && inMonth && "bg-slate-50/80 dark:bg-slate-900/40"
      )}
    >
      <span
        className={cn(
          "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold",
          isToday ? "bg-blue-600 text-white" : "text-slate-700 dark:text-slate-200"
        )}
      >
        {date}
      </span>

      {hasEvents && (
        <div className="mt-auto space-y-0.5 overflow-hidden">
          {events.slice(0, 2).map((event) => (
            <div key={event.id} className="flex items-center gap-1 truncate text-[10px] text-slate-600 dark:text-slate-300">
              <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", typeDotClasses[event.type] || "bg-slate-400")} />
              <span className="truncate">{event.title}</span>
            </div>
          ))}
          {events.length > 2 && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500">+{events.length - 2} more</p>
          )}
        </div>
      )}
    </button>
  );
}
