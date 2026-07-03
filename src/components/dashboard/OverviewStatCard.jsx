import { cn } from "@/lib/utils";

const TONE_STYLES = {
  neutral: "border-slate-200 bg-slate-50",
  blue: "border-blue-200 bg-blue-50",
  green: "border-emerald-200 bg-emerald-50",
};

const LABEL_TONE_STYLES = {
  neutral: "text-slate-500",
  blue: "text-blue-600",
  green: "text-emerald-600",
};

const VALUE_TONE_STYLES = {
  neutral: "text-slate-900",
  blue: "text-blue-700",
  green: "text-emerald-700",
};

export default function OverviewStatCard({ label, value, tone = "neutral", withDot }) {
  return (
    <div className={cn("flex-1 rounded-xl border px-5 py-4", TONE_STYLES[tone])}>
      <p className={cn("text-xs font-semibold tracking-wide", LABEL_TONE_STYLES[tone])}>
        {label}
      </p>
      <p className={cn("mt-1.5 flex items-center gap-1.5 text-2xl font-bold", VALUE_TONE_STYLES[tone])}>
        {withDot && <span className="h-2 w-2 rounded-full bg-blue-600" />}
        {value}
      </p>
    </div>
  );
}
