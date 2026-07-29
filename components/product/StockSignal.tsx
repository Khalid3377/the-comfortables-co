"use client";

import { cn } from "@/lib/utils";

export interface StockSignalProps {
  size?: string;
  stock: number;
  variant?: "pdp" | "grid";
  className?: string;
}

export function StockSignal({ size, stock, variant = "pdp", className }: StockSignalProps) {
  if (variant === "pdp") {
    if (!size || stock <= 0 || stock >= 5) return null;

    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 motion-reduce:animate-none",
          className
        )}
        role="status"
      >
        <span className="relative flex h-2 w-2 motion-reduce:animate-none">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        Only {stock} left in Size {size}
      </div>
    );
  }

  if (stock >= 10) return null;

  return (
    <span
      className={cn(
        "absolute bottom-3 left-3 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700",
        className
      )}
    >
      Low stock
    </span>
  );
}
