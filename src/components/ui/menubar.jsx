import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root ref={ref} className={cn("flex h-10 items-center", className)} {...props} />
));

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger ref={ref} className={cn("px-3 py-1.5 text-sm", className)} {...props} />
));

const MenubarContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content ref={ref} className={cn("min-w-[12rem] rounded-md border p-1", className)} {...props} />
  </MenubarPrimitive.Portal>
));

const MenubarItem = React.forwardRef(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn("flex items-center px-2 py-1.5 text-sm", inset && "pl-8", className)}
    {...props}
  />
));

const MenubarCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem ref={ref} className={cn("pl-8 pr-2 py-1.5", className)} checked={checked} {...props}>
    <span className="absolute left-2">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));

const MenubarRadioItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem ref={ref} className={cn("pl-8 pr-2 py-1.5", className)} {...props}>
    <span className="absolute left-2">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));

export {
  Menubar,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioItem,
};