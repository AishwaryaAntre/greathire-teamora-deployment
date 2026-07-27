const STAT_DOTS = ["bg-rose-300", "bg-blue-200", "bg-blue-400"];
const AVATAR_DOTS = ["bg-indigo-200", "bg-blue-200", "bg-orange-300"];

function StatCard({ label, value, accent, showBar, barWidth }) {
  return (
    <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3.5">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-1.5 text-xl font-bold ${accent}`}>{value}</p>
      {showBar && (
        <div className="mt-2.5 h-1 w-full rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-primary"
            style={{ width: barWidth }}
          />
        </div>
      )}
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-t-2xl border border-b-0 border-border bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        {STAT_DOTS.map((c, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-full ${c}`} />
        ))}
      </div>
      <div className="flex gap-3 px-4 pt-4">
        <StatCard
          label="ACTIVE USERS"
          value="1,248"
          accent="text-primary"
          showBar
          barWidth="70%"
        />
        <StatCard
          label="EFFICIENCY"
          value="94.2%"
          accent="text-primary"
          showBar
          barWidth="94%"
        />
        <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3.5">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
            OPEN REQUESTS
          </p>
          <p className="mt-1.5 text-xl font-bold text-brand-amber">12</p>
          <div className="mt-2.5 flex -space-x-1.5">
            {AVATAR_DOTS.map((c, i) => (
              <span
                key={i}
                className={`h-4 w-4 rounded-full border-2 border-card ${c}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-16 px-4 pt-4" aria-hidden="true" />
    </div>
  );
}
