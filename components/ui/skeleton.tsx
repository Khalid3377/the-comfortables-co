import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-brand-border/60 motion-reduce:animate-none dark:bg-white/10", className)}
      aria-hidden="true"
    />
  );
}
