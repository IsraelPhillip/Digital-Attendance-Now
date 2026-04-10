import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../lib/utils";

export const Slider = React.forwardRef(function Slider(
  { className, ...props },
  ref
) {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="h-5 w-5 rounded-full border-2 border-primary bg-background" />
    </SliderPrimitive.Root>
  );
});