import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnnouncementCard({ eyebrow, title, body, ctaLabel, onCtaClick }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-sm">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-100">
        <Megaphone className="h-3.5 w-3.5" />
        {eyebrow}
      </p>
      <h4 className="mt-2 text-base font-bold">{title}</h4>
      <p className="mt-1 text-sm text-blue-100">{body}</p>
      <Button
        onClick={onCtaClick}
        className="mt-4 bg-white dark:bg-slate-900 text-blue-700 hover:bg-blue-50"
        size="sm"
      >
        {ctaLabel}
      </Button>
    </div>
  );
}
