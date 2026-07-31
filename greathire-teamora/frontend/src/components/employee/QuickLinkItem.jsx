import * as icons from "lucide-react";

export default function QuickLinkItem({ label, icon, onClick }) {
  const Icon = icons[icon] ?? icons.Circle;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </button>
  );
}
