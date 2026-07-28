import { cn } from "@/lib/utils";

export default function Avatar({ initials, className }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        className
      )}
    >
      {initials}
    </span>
  );
}
