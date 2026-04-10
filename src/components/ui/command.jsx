import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

const Command = React.forwardRef(function Command({ className, ...props }, ref) {
  return (
    <CommandPrimitive
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
});

const CommandInput = React.forwardRef(function CommandInput({ className, ...props }, ref) {
  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn("w-full bg-transparent outline-none", className)}
        {...props}
      />
    </div>
  );
});

export { Command, CommandInput };