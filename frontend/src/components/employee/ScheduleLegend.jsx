export default function ScheduleLegend({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
      {items.map(({ id, label, color }) => (
        <div key={id} className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
