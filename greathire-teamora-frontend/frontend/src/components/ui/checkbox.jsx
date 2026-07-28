import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        ref={ref}
        onClick={() => onCheckedChange?.(!checked)}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-[4px] border border-input shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          checked
            ? "bg-primary border-primary text-primary-foreground"
            : "bg-card",
          className
        )}
        {...props}
      >
        {checked && <Check className="h-3.5 w-3.5 mx-auto" strokeWidth={3} />}
      </button>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
