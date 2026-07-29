import type { LoyaltyTier } from "@/lib/supabase/types";

export const LOYALTY_RULES = {
  PURCHASE_POINTS_PER_100: 10,
  REVIEW_POINTS: 50,
  REFERRAL_POINTS: 200,
  SIGNUP_BONUS: 100,
  BIRTHDAY_MULTIPLIER: 2,
  REDEMPTION_POINTS: 100,
  REDEMPTION_VALUE_INR: 10
} as const;

export const LOYALTY_TIERS: Record<
  LoyaltyTier,
  { min: number; max: number | null; nextTier: LoyaltyTier | null; nextThreshold: number | null }
> = {
  Seedling: { min: 0, max: 999, nextTier: "Bloom", nextThreshold: 1000 },
  Bloom: { min: 1000, max: 2999, nextTier: "Forest", nextThreshold: 3000 },
  Forest: { min: 3000, max: null, nextTier: null, nextThreshold: null }
};

export interface LoyaltySnapshot {
  pointsBalance: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  nextThreshold: number | null;
  nextTier: LoyaltyTier | null;
  pointsExpiryDate: string;
  tierProgress: number;
}

export function calculatePurchasePoints(amountInr: number, isBirthdayMonth = false): number {
  const base = Math.floor(amountInr / 100) * LOYALTY_RULES.PURCHASE_POINTS_PER_100;
  return isBirthdayMonth ? base * LOYALTY_RULES.BIRTHDAY_MULTIPLIER : base;
}

export function getTierFromPoints(points: number): LoyaltyTier {
  if (points >= LOYALTY_TIERS.Forest.min) return "Forest";
  if (points >= LOYALTY_TIERS.Bloom.min) return "Bloom";
  return "Seedling";
}

export function getNextTierInfo(tier: LoyaltyTier): { nextTier: LoyaltyTier | null; nextThreshold: number | null } {
  const config = LOYALTY_TIERS[tier];
  return { nextTier: config.nextTier, nextThreshold: config.nextThreshold };
}

export function getTierProgress(points: number, tier: LoyaltyTier): number {
  const config = LOYALTY_TIERS[tier];
  if (config.nextThreshold === null) return 100;

  const rangeStart = config.min;
  const rangeEnd = config.nextThreshold;
  const progress = ((points - rangeStart) / (rangeEnd - rangeStart)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function getPointsExpiryDate(fromDate = new Date()): string {
  const expiry = new Date(fromDate);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry.toISOString();
}

export function pointsToDiscountInr(points: number): number {
  return Math.floor(points / LOYALTY_RULES.REDEMPTION_POINTS) * LOYALTY_RULES.REDEMPTION_VALUE_INR;
}

export function buildLoyaltySnapshot(
  pointsBalance: number,
  lifetimePoints = pointsBalance,
  expiryDate?: string
): LoyaltySnapshot {
  const tier = getTierFromPoints(lifetimePoints);
  const { nextTier, nextThreshold } = getNextTierInfo(tier);

  return {
    pointsBalance,
    lifetimePoints,
    tier,
    nextThreshold,
    nextTier,
    pointsExpiryDate: expiryDate ?? getPointsExpiryDate(),
    tierProgress: getTierProgress(lifetimePoints, tier)
  };
}

export const DEMO_LOYALTY_SNAPSHOT: LoyaltySnapshot = buildLoyaltySnapshot(420, 420);

// ─── Alias exports for rewards page ───────────────────────────────────────────
export const POINTS_RULES = {
  PURCHASE_PER_100: LOYALTY_RULES.PURCHASE_POINTS_PER_100,
  REVIEW: LOYALTY_RULES.REVIEW_POINTS,
  REFERRAL: LOYALTY_RULES.REFERRAL_POINTS,
  SIGNUP: LOYALTY_RULES.SIGNUP_BONUS,
  BIRTHDAY_MULTIPLIER: LOYALTY_RULES.BIRTHDAY_MULTIPLIER
} as const;

export const REDEMPTION_RATE = {
  points: LOYALTY_RULES.REDEMPTION_POINTS,
  discount: LOYALTY_RULES.REDEMPTION_VALUE_INR
} as const;

export interface PointsLedgerEntry {
  id: string;
  type: "PURCHASE" | "REVIEW" | "REFERRAL" | "SIGNUP" | "BIRTHDAY";
  points: number;
  description: string;
  createdAt: string;
}

export function getTierInfo(points: number) {
  const name = getTierFromPoints(points);
  const config = LOYALTY_TIERS[name];
  return { name, ...config };
}
