export default function AttendanceLegend({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-muted-foreground">
      {items.map((item) => (
        <span key={item.id} className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${item.color}`} />
          {item.label.toUpperCase()}
        </span>
      ))}
    </div>
  );
}
