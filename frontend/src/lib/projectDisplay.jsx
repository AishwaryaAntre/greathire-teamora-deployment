import { Badge } from "@/components/ui/badge";

// Kept in sync with Report.jsx's PROJECT_STATUS_COLORS so the same status
// reads the same way everywhere in the app (admin list, employee list, and
// the Reports & Analytics completion chart).
export const STATUS_BADGE_CLASS = {
  Active: "bg-blue-50 text-blue-700",
  Working: "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  "On Hold": "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-50 text-red-700",
};

export const IMPORTANCE_BADGE_CLASS = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
};

export function formatDateShort(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function StatusBadge({ status }) {
  return <Badge className={STATUS_BADGE_CLASS[status] || "bg-slate-100 text-slate-600"}>{status}</Badge>;
}

export function ImportanceBadge({ importance }) {
  return <Badge className={IMPORTANCE_BADGE_CLASS[importance] || "bg-slate-100 text-slate-600"}>{importance}</Badge>;
}
