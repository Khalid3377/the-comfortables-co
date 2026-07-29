"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export interface StickyCartBarProps {
  productName: string;
  price: number;
  onAddToCart: () => void;
  addToCartButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function StickyCartBar({
  productName,
  price,
  onAddToCart,
  addToCartButtonRef
}: StickyCartBarProps) {
  const [isPastButton, setIsPastButton] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const target = addToCartButtonRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastButton(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [addToCartButtonRef]);

  const isVisible = isPastButton;

  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-[#EAEAEA] bg-white pb-[env(safe-area-inset-bottom)] md:hidden dark:border-white/10 dark:bg-[#171a19] ${
        isVisible ? "pointer-events-auto" : "pointer-events-none"
      }`}
      initial={false}
      animate={{ y: prefersReducedMotion ? 0 : isVisible ? 0 : "100%" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      aria-hidden={!isVisible}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-brand-ink dark:text-white">{productName}</p>
          <p className="text-sm font-bold text-brand-teal dark:text-white">{formatCurrency(price)}</p>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          className="shrink-0 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-teal-light"
        >
          Add to cart
        </button>
      </div>
    </motion.div>
  );
}
