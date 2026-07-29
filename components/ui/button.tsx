import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex h-11 items-center justify-center rounded-brand px-5 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-brand-teal text-white hover:bg-[#255c56]",
        variant === "secondary" && "border border-brand-border bg-white/70 text-brand-ink hover:border-brand-teal dark:border-white/10 dark:bg-white/10 dark:text-white",
        variant === "ghost" && "bg-transparent text-brand-ink hover:bg-brand-border/50 dark:text-white dark:hover:bg-white/10",
        className
      )}
      {...props}
    />
  );
}
