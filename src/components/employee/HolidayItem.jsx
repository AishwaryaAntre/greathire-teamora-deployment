export default function HolidayItem({ day, month, name, meta }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <span className="text-sm font-bold leading-none">{day}</span>
        <span className="text-[10px] font-medium leading-none">{month}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}
