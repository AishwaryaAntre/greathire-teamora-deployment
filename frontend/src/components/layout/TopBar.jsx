import { Globe, ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function TopBar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-end gap-4 px-6 py-6 sm:px-10">
      <button
        type="button"
        disabled
        title="More languages coming soon"
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 cursor-not-allowed opacity-60"
      >
        <Globe className="h-4 w-4" />
        English (US)
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 transition-colors hover:bg-muted hover:text-slate-900 dark:hover:text-white dark:text-slate-300"
      >
        {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
      </button>
    </div>
  );
}
