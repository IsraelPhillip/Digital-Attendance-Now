import * as React from "react";
import { cn } from "../../lib/utils";

const Textarea = React.forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm",
        className
      )}
      {...props}
    />
  );
});

export { Textarea };