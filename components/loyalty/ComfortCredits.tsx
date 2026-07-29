"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  buildLoyaltySnapshot,
  calculatePurchasePoints,
  DEMO_LOYALTY_SNAPSHOT,
  LOYALTY_RULES,
  type LoyaltySnapshot
} from "@/lib/loyalty";
import { createBrowserClient, fetchLoyaltyPoints } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ComfortCreditsProps {
  orderTotal?: number;
  compact?: boolean;
  className?: string;
}

const RING_RADIUS = 42;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

function formatExpiryDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(isoDate));
}

function ProgressRing({ progress, reducedMotion }: { progress: number; reducedMotion: boolean | null }) {
  const offset = RING_CIRCUMFERENCE - (progress / 100) * RING_CIRCUMFERENCE;

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r={RING_RADIUS}
          fill="none"
          stroke="#EAEAEA"
          strokeWidth="6"
        />
        <motion.circle
          cx="48"
          cy="48"
          r={RING_RADIUS}
          fill="none"
          stroke="#2E6F68"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
          animate={{ strokeDashoffset: reducedMotion ? offset : offset }}
          transition={{ duration: reducedMotion ? 0 : 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-display text-lg font-bold text-brand-teal">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}

export function ComfortCredits({ orderTotal = 0, compact = false, className }: ComfortCreditsProps) {
  const [snapshot, setSnapshot] = useState<LoyaltySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const earnedThisOrder = calculatePurchasePoints(orderTotal);

  useEffect(() => {
    let active = true;

    async function loadLoyalty() {
      const supabase = createBrowserClient();

      if (!supabase) {
        if (active) {
          setSnapshot(DEMO_LOYALTY_SNAPSHOT);
          setLoading(false);
        }
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setSnapshot(DEMO_LOYALTY_SNAPSHOT);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await fetchLoyaltyPoints(supabase, user.id);

      if (!active) return;

      if (error || !data) {
        setSnapshot(buildLoyaltySnapshot(LOYALTY_RULES.SIGNUP_BONUS, LOYALTY_RULES.SIGNUP_BONUS));
      } else {
        setSnapshot(
          buildLoyaltySnapshot(data.points_balance, data.lifetime_points, data.updated_at)
        );
      }

      setLoading(false);
    }

    loadLoyalty();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={cn("rounded-xl border border-[#EAEAEA] bg-white p-4 dark:border-white/10 dark:bg-white/5", className)}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!snapshot) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-[#EAEAEA] bg-white p-4 dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <div className={cn("flex items-center gap-4", compact ? "gap-3" : "gap-4")}>
        <ProgressRing progress={snapshot.tierProgress} reducedMotion={prefersReducedMotion} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold uppercase tracking-[0.16em] text-brand-teal">
            Comfort Credits
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-brand-ink dark:text-white">
            {snapshot.pointsBalance.toLocaleString("en-IN")} pts
          </p>
          <p className="mt-1 text-xs text-brand-muted dark:text-white/60">
            {snapshot.tier} tier
            {snapshot.nextThreshold
              ? ` · ${snapshot.nextThreshold - snapshot.lifetimePoints} pts to ${snapshot.nextTier}`
              : " · top tier unlocked"}
          </p>
          <p className="mt-1 text-xs text-brand-muted dark:text-white/60">
            Expires {formatExpiryDate(snapshot.pointsExpiryDate)}
          </p>
          {orderTotal > 0 ? (
            <p className="mt-2 text-xs font-medium text-brand-teal">
              +{earnedThisOrder} pts on this order
            </p>
          ) : null}
        </div>
      </div>

      {!compact ? (
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-brand-muted dark:text-white/60">
          <span className="rounded-full bg-[#FAFAF7] px-2 py-1 dark:bg-white/10">
            {LOYALTY_RULES.PURCHASE_POINTS_PER_100} pts / ₹100
          </span>
          <span className="rounded-full bg-[#FAFAF7] px-2 py-1 dark:bg-white/10">
            {LOYALTY_RULES.REDEMPTION_POINTS} pts = ₹{LOYALTY_RULES.REDEMPTION_VALUE_INR}
          </span>
        </div>
      ) : null}

      {!compact ? (
        <Link
          href="/account/rewards"
          className="mt-4 inline-flex text-xs font-semibold text-brand-teal transition hover:text-brand-teal-light"
        >
          View rewards dashboard →
        </Link>
      ) : null}
    </div>
  );
}
