import { cn } from "@/lib/utils";

const dotClasses = {
  done: "bg-emerald-500",
  warning: "bg-amber-500",
  pending: "bg-muted-foreground/30",
};

export default function TimelineItem({ time, label, state, isLast }) {
  return (
    <div className="relative flex gap-3 pb-6 last:pb-0">
      {!isLast && (
        <span className="absolute left-[5px] top-3 h-full w-px bg-border" aria-hidden="true" />
      )}
      <span className={cn("z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", dotClasses[state])} />
      <div>
        {time && <p className="text-xs font-medium text-muted-foreground">{time}</p>}
        <p className={cn("text-sm font-medium", state === "pending" ? "text-muted-foreground" : "text-foreground")}>
          {label}
        </p>
      </div>
    </div>
  );
}
