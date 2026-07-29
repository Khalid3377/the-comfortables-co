"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "mission_banner_visits";
const DISMISS_AFTER = 3;

export function MissionBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    const visits = raw ? parseInt(raw, 10) : 0;
    if (visits >= DISMISS_AFTER) {
      setDismissed(true);
    } else {
      localStorage.setItem(STORAGE_KEY, String(visits + 1));
    }
  }, []);

  if (!mounted || dismissed) return null;

  return (
    <div
      id="mission-banner"
      className="relative flex h-9 items-center justify-center overflow-hidden bg-brand-teal px-10 text-white"
    >
      {/* Marquee on mobile, static on desktop */}
      <div className="flex w-full items-center justify-center overflow-hidden">
        <p className="whitespace-nowrap text-[11px] font-semibold tracking-[0.12em] md:animate-none animate-[marquee_18s_linear_infinite]">
          🌿&nbsp;Every order plants 1 tree&nbsp;·&nbsp;OEKO-TEX® certified&nbsp;·&nbsp;Free returns&nbsp;·&nbsp;🌿&nbsp;Every order plants 1 tree&nbsp;·&nbsp;OEKO-TEX® certified&nbsp;·&nbsp;Free returns
        </p>
      </div>
      <button
        aria-label="Dismiss banner"
        onClick={() => {
          setDismissed(true);
          localStorage.setItem(STORAGE_KEY, String(DISMISS_AFTER));
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 opacity-70 transition hover:opacity-100"
      >
        <X size={14} />
      </button>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[marquee_18s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}
