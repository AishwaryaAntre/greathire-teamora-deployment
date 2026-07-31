export default function SnapshotRow({ label, value, percent, color }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
