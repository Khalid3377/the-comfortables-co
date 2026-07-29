import type { Metadata } from "next";
import { ComfortCredits } from "@/components/loyalty/ComfortCredits";
import {
  POINTS_RULES,
  REDEMPTION_RATE,
  getTierInfo,
  type PointsLedgerEntry
} from "@/lib/loyalty";

export const metadata: Metadata = {
  title: "Comfort Credits",
  description: "Your loyalty rewards dashboard — track points, tiers, and redeem comfort credits."
};

// Mock data — replace with real Supabase fetch server-side
const MOCK_BALANCE = 1250;

const MOCK_LEDGER: PointsLedgerEntry[] = [
  { id: "1", type: "PURCHASE", points: 189, description: "CloudKnit Everyday Tee", createdAt: "2025-05-10T10:00:00Z" },
  { id: "2", type: "REVIEW", points: 50, description: "Review on BambooFlow Lounge Set", createdAt: "2025-05-18T14:00:00Z" },
  { id: "3", type: "REFERRAL", points: 200, description: "Friend referred: Priya M.", createdAt: "2025-06-01T09:00:00Z" },
  { id: "4", type: "SIGNUP", points: 100, description: "Welcome bonus", createdAt: "2025-04-01T08:00:00Z" },
];

export default function RewardsPage() {
  const tier = getTierInfo(MOCK_BALANCE);
  const cashValue = Math.floor(MOCK_BALANCE / REDEMPTION_RATE.points) * REDEMPTION_RATE.discount;

  return (
    <section className="container-page py-16">
      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">
        Loyalty Programme
      </div>
      <h1 className="font-display text-6xl font-semibold leading-tight">Comfort Credits</h1>
      <p className="mt-3 max-w-xl text-base text-brand-muted dark:text-white/70">
        Earn points on every purchase, review, and referral. Redeem for instant discounts.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* ─── Left: Widget ──────────────────────────── */}
        <div>
          <ComfortCredits />
          {/* Redemption info */}
          <div className="mt-5 rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm font-semibold text-brand-ink dark:text-white">Current balance value</p>
            <p className="mt-1 font-display text-3xl font-bold text-brand-teal">₹{cashValue}</p>
            <p className="mt-2 text-xs text-brand-muted dark:text-white/60">
              {REDEMPTION_RATE.points} credits = ₹{REDEMPTION_RATE.discount} · Apply at checkout
            </p>
            <button
              type="button"
              className="mt-4 w-full rounded-full bg-brand-teal py-3 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
            >
              Redeem credits at checkout
            </button>
          </div>
        </div>

        {/* ─── Right: How to earn + history ─────────── */}
        <div className="flex flex-col gap-6">
          {/* How to earn */}
          <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold">How to earn</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Purchase", desc: "10 pts per ₹100 spent", pts: `+${POINTS_RULES.PURCHASE_PER_100}`, color: "bg-brand-teal/10 text-brand-teal" },
                { label: "Write a review", desc: "Verified purchase reviews only", pts: `+${POINTS_RULES.REVIEW}`, color: "bg-brand-teal/10 text-brand-teal" },
                { label: "Refer a friend", desc: "When they make their first purchase", pts: `+${POINTS_RULES.REFERRAL}`, color: "bg-brand-teal/10 text-brand-teal" },
                { label: "Sign up bonus", desc: "One-time welcome gift", pts: `+${POINTS_RULES.SIGNUP}`, color: "bg-brand-sand/30 text-brand-brown" },
                { label: "Birthday month", desc: "Double points all month", pts: "2×", color: "bg-amber-50 text-amber-700" },
              ].map(({ label, desc, pts, color }) => (
                <div key={label} className="flex items-start gap-4 rounded-brand bg-brand-paper p-4 dark:bg-white/5">
                  <span className={`mt-0.5 flex-shrink-0 rounded-full px-3 py-1 text-xs font-bold ${color}`}>
                    {pts}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-ink dark:text-white">{label}</p>
                    <p className="mt-0.5 text-xs text-brand-muted dark:text-white/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier overview */}
          <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold">Tier benefits</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { name: "🌱 Seedling", range: "0 – 999 pts", perks: "Earn base points on every order", active: tier.name === "Seedling" },
                { name: "🌸 Bloom", range: "1,000 – 2,999 pts", perks: "Priority customer support + early access", active: tier.name === "Bloom" },
                { name: "🌲 Forest", range: "3,000+ pts", perks: "Exclusive drops + double referral bonus", active: tier.name === "Forest" },
              ].map(({ name, range, perks, active }) => (
                <div
                  key={name}
                  className={`rounded-brand border p-4 transition ${
                    active
                      ? "border-brand-teal bg-brand-teal/5"
                      : "border-brand-border dark:border-white/10"
                  }`}
                >
                  <p className="text-base font-bold text-brand-ink dark:text-white">{name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-brand-teal">{range}</p>
                  <p className="mt-2 text-xs text-brand-muted dark:text-white/60">{perks}</p>
                  {active && (
                    <span className="mt-3 inline-block rounded-full bg-brand-teal px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      Current tier
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Points history */}
          <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold">Points history</h2>
            <div className="mt-5 grid gap-3">
              {MOCK_LEDGER.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between rounded-brand bg-brand-paper px-4 py-3 dark:bg-white/5">
                  <div>
                    <p className="text-sm font-semibold text-brand-ink dark:text-white">{entry.description}</p>
                    <p className="mt-0.5 text-[11px] text-brand-muted dark:text-white/60">
                      {new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-brand-teal">+{entry.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
