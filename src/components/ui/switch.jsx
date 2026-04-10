import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

export const Switch = React.forwardRef(function Switch(
  { className, ...props },
  ref
) {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      className={cn(
        "inline-flex h-6 w-11 items-center rounded-full bg-input",
        className
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb className="h-5 w-5 rounded-full bg-background transition-transform data-[state=checked]:translate-x-5" />
    </SwitchPrimitives.Root>
  );
});