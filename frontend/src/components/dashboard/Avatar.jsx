import { cn } from "@/lib/utils";

export default function Avatar({ initials, src, name, className }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold",
        className
      )}
    >
      {src ? (
        <img src={src} alt={name ? `${name}'s profile` : ""} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
