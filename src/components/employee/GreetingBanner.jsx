export default function GreetingBanner({ name, role, dateLabel, lastLogin }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <span role="img" aria-label="waving hand">
            👋
          </span>
          Good Morning, {name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {role} • Today is a great day to stay productive.
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-primary">{dateLabel}</p>
        <p className="text-xs text-muted-foreground">Last Login: {lastLogin}</p>
      </div>
    </div>
  );
}
