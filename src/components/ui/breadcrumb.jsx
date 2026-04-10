import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";

const Breadcrumb = React.forwardRef((props, ref) => <nav ref={ref} {...props} />);
const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol ref={ref} className={cn("flex gap-2 text-sm", className)} {...props} />
));
const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("flex items-center", className)} {...props} />
));

const BreadcrumbLink = React.forwardRef(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return <Comp ref={ref} className={cn(className)} {...props} />;
});

const BreadcrumbPage = ({ className, ...props }) => (
  <span className={cn("text-foreground", className)} {...props} />
);

const BreadcrumbSeparator = ({ children }) => (
  <li>{children ?? <ChevronRight />}</li>
);

const BreadcrumbEllipsis = () => (
  <span>
    <MoreHorizontal />
  </span>
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};