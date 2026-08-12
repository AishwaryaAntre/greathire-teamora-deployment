import { Card } from "@/components/ui/card";

export default function MetricCard({ label, value, valueClassName, right }) {
  return (
    <Card className="flex flex-1 items-center justify-between p-5 transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-slate-100 dark:hover:bg-slate-900 hover:shadow-lg">
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
