import { cn } from "@/lib/utils";

export default function FeaturePill({ icon: Icon, label, iconClassName, className }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 shadow-sm",
        className
      )}
    >
      <Icon className={cn("h-[18px] w-[18px]", iconClassName)} strokeWidth={2.25} />
      <span className="text-[15px] font-medium text-foreground">{label}</span>
    </div>
  );
}
