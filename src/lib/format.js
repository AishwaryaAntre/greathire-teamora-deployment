const AVATAR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
];

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export function getAvatarClass(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i)) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[hash];
}

export function formatTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ACTIVITY_DOT_CLASS = {
  attendance: "bg-emerald-500",
  leave: "bg-amber-500",
  system: "bg-slate-400",
};

export function getActivityDotClass(type) {
  return ACTIVITY_DOT_CLASS[type] || "bg-slate-400";
}

const SNAPSHOT_COLOR_ORDER = ["bg-slate-300", "bg-primary", "bg-amber-400", "bg-rose-400"];

export function getSnapshotColor(index) {
  return SNAPSHOT_COLOR_ORDER[index] || "bg-slate-300";
}
