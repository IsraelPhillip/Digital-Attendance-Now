import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(function ToastViewport({ className, ...props }, ref) {
  return (
    <ToastPrimitives.Viewport
      ref={ref}
      className={cn("fixed top-0 p-4", className)}
      {...props}
    />
  );
});

const toastVariants = cva("rounded-md border p-4", {
  variants: {
    variant: {
      default: "bg-background",
      destructive: "bg-destructive text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const Toast = React.forwardRef(function Toast({ className, variant, ...props }, ref) {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});

const ToastClose = React.forwardRef(function ToastClose(props, ref) {
  return (
    <ToastPrimitives.Close ref={ref} {...props}>
      <X className="h-4 w-4" />
    </ToastPrimitives.Close>
  );
});

const ToastTitle = React.forwardRef(function ToastTitle({ className, ...props }, ref) {
  return <ToastPrimitives.Title ref={ref} className={cn("font-semibold", className)} {...props} />;
});

const ToastDescription = React.forwardRef(function ToastDescription({ className, ...props }, ref) {
  return <ToastPrimitives.Description ref={ref} className={cn("text-sm", className)} {...props} />;
});

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
};