import * as React from "react";
import { cn } from "../../lib/utils";

export const Table = React.forwardRef(function Table({ className, ...props }, ref) {
  return (
    <div className="w-full overflow-auto">
      <table ref={ref} className={cn("w-full text-sm", className)} {...props} />
    </div>
  );
});

export const TableHeader = React.forwardRef(function TableHeader(props, ref) {
  return <thead ref={ref} {...props} />;
});

export const TableBody = React.forwardRef(function TableBody(props, ref) {
  return <tbody ref={ref} {...props} />;
});

export const TableRow = React.forwardRef(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn("border-b hover:bg-muted/50", className)}
      {...props}
    />
  );
});

export const TableHead = React.forwardRef(function TableHead(props, ref) {
  return <th ref={ref} className="p-4 text-left" {...props} />;
});

export const TableCell = React.forwardRef(function TableCell(props, ref) {
  return <td ref={ref} className="p-4" {...props} />;
});