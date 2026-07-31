import { cn } from "@/lib/utils";

export default function IconButton({ icon: Icon, label, className }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200",
        className
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
    </button>
  );
}
