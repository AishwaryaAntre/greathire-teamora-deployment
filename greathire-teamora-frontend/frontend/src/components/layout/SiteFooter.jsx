import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms of Service", to: "/terms-of-service" },
  ],
  [
    { label: "Security", to: "/security" },
    { label: "Support", to: "/support" },
  ],
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-6 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-muted-foreground">
          © 2026 Babde Pvt. Ltd. All rights reserved.
        </p>
        <div className="flex flex-col items-center gap-1 sm:items-end">
          {FOOTER_LINKS.map((row, i) => (
            <div key={i} className="flex gap-5">
              {row.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
