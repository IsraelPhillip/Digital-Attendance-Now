import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

const NavigationMenu = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root ref={ref} className={cn("flex justify-center", className)} {...props}>
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));

const NavigationMenuList = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List ref={ref} className={cn("flex space-x-1", className)} {...props} />
));

const navigationMenuTriggerStyle = cva("px-4 py-2 text-sm");

const NavigationMenuTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  >
    {children}
    <ChevronDown className="ml-1 h-3 w-3" />
  </NavigationMenuPrimitive.Trigger>
));

const NavigationMenuContent = React.forwardRef(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content ref={ref} className={cn("absolute", className)} {...props} />
));

const NavigationMenuViewport = React.forwardRef(({ className, ...props }, ref) => (
  <div className="absolute top-full flex justify-center">
    <NavigationMenuPrimitive.Viewport ref={ref} className={cn("rounded-md border", className)} {...props} />
  </div>
));

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
};