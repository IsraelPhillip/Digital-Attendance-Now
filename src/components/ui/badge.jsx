import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva("inline-flex rounded-full px-2.5 py-0.5 text-xs", {
  variants: {
    variant: {
      default: "bg-primary text-white",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      outline: "border",
    },
  },
  defaultVariants: { variant: "default" },
});

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };