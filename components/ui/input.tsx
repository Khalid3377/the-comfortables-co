import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn("focus-ring h-12 w-full rounded-brand border border-brand-border bg-transparent px-3 text-sm dark:border-white/10", className)}
      {...props}
    />
  );
}
