import * as React from "react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <div className="relative">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          className={cn(
            "peer inline-flex h-12 w-20 shrink-0 cursor-pointer items-center rounded-full border-2 border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-white",
            className
          )}
          data-state={checked ? "checked" : "unchecked"}
          onClick={() => onCheckedChange?.(!checked)}
          ref={ref}
          {...props}
        >
          <span
            className={cn(
              "pointer-events-none block h-8 w-8 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0",
              checked ? "translate-x-8" : "translate-x-0"
            )}
            data-state={checked ? "checked" : "unchecked"}
          />
        </button>
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
