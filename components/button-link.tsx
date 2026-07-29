import Link from "next/link";
import { cn } from "@/lib/utils";

export function ButtonLink({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex h-12 items-center justify-center rounded-full px-7 text-sm font-semibold transition",
        variant === "primary"
          ? "bg-brand-ink text-white shadow-[0_18px_50px_rgba(43,43,43,0.18)] hover:bg-brand-teal"
          : "border border-brand-border bg-white/82 text-brand-ink shadow-sm hover:border-brand-teal dark:border-white/10 dark:bg-white/10 dark:text-white"
      )}
    >
      {children}
    </Link>
  );
}
