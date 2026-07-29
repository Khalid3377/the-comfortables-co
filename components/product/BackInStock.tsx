"use client";

import type { FormEvent } from "react";
import { Check } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BackInStockProps {
  productId: string;
  variantId: string;
  size: string;
  defaultEmail?: string;
  className?: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

export function BackInStock({ productId, variantId, size, defaultEmail = "", className }: BackInStockProps) {
  const [expanded, setExpanded] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [formState, setFormState] = useState<FormState>("idle");
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("submitting");

    try {
      const response = await fetch("/api/notify-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, email, size })
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <div
        className={cn(
          "flex min-h-10 items-center gap-2 rounded-brand border border-brand-teal/30 bg-brand-teal/5 px-3 text-xs font-medium text-brand-teal",
          className
        )}
      >
        <Check size={14} aria-hidden="true" />
        We&apos;ll email you when Size {size} is back
      </div>
    );
  }

  return (
    <div className={cn("min-w-[3rem]", className)}>
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="h-10 w-full min-w-12 rounded-brand border border-dashed border-brand-border px-3 text-xs font-semibold text-brand-muted transition hover:border-brand-teal hover:text-brand-teal dark:border-white/20"
        >
          Notify me
        </button>
      ) : (
        <AnimatePresence initial={false}>
          <motion.form
            key="notify-form"
            initial={prefersReducedMotion ? false : { height: 40, opacity: 0.8 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 40, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-brand border border-brand-border bg-white p-2 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                className="h-10 flex-1 rounded-brand border border-brand-border bg-transparent px-3 text-sm outline-none focus:border-brand-teal dark:border-white/10"
              />
              <button
                type="submit"
                disabled={formState === "submitting"}
                className="h-10 shrink-0 rounded-brand bg-brand-teal px-4 text-sm font-semibold text-white transition hover:bg-brand-teal-light disabled:opacity-60"
              >
                {formState === "submitting" ? "Saving..." : "Alert me"}
              </button>
            </div>
            {formState === "error" ? (
              <p className="mt-2 text-xs text-red-500">Something went wrong. Please try again.</p>
            ) : null}
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  );
}
