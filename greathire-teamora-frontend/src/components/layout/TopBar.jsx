import { Globe, ChevronDown, Moon } from "lucide-react";

export default function TopBar() {
  return (
    <div className="flex items-center justify-end gap-4 px-6 py-6 sm:px-10">
      <button
        type="button"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <Globe className="h-4 w-4" />
        English (US)
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-label="Toggle dark mode"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-muted hover:text-slate-900"
      >
        <Moon className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
