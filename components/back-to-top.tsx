"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Cloud } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-3 shadow-[0_12px_40px_rgba(43,43,43,0.12)] transition dark:border-white/10 dark:bg-[#171a19] text-brand-ink dark:text-white group"
          type="button"
        >
          <span className="relative flex h-6 w-6 items-center justify-center text-brand-brown dark:text-brand-sand transition duration-300 group-hover:animate-bounce">
            <Cloud size={20} fill="currentColor" fillOpacity={0.15} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Top</span>
          <ArrowUp size={14} className="text-brand-brown dark:text-brand-sand transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
