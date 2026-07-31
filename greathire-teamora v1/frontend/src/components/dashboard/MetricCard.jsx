import { Card } from "@/components/ui/card";

export default function MetricCard({ label, value, valueClassName, right }) {
  return (
    <Card className="flex flex-1 items-center justify-between p-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className={`mt-1.5 text-xl font-bold ${valueClassName ?? "text-slate-900 dark:text-white"}`}>
          {value}
        </p>
      </div>
      {right}
    </Card>
  );
}
