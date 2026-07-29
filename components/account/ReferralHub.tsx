"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Referral {
  id: string;
  referredEmail: string;
  status: "pending" | "rewarded";
  createdAt: string;
}

interface ReferralHubProps {
  userId?: string;
  userEmail?: string;
  referralCode?: string;
  referrals?: Referral[];
}

// Mock data — replace with Supabase fetch in production
const MOCK_REFERRALS: Referral[] = [
  { id: "1", referredEmail: "priya***@gmail.com", status: "rewarded", createdAt: "2025-05-10" },
  { id: "2", referredEmail: "ananya***@gmail.com", status: "pending", createdAt: "2025-06-01" },
];

export function ReferralHub({
  referralCode = "COMFORT-REF-DEMO",
  referrals = MOCK_REFERRALS,
}: ReferralHubProps) {
  const [copied, setCopied] = useState(false);

  const referralLink = `https://thecomfortables.co/?ref=${referralCode}`;

  const whatsappMessage = encodeURIComponent(
    `I've been wearing The Comfortable Co. and it's incredible. Use my link for ₹300 off your first order: ${referralLink}`
  );
  const mailtoBody = encodeURIComponent(
    `Hey!\n\nI've been wearing The Comfortable Co. — a premium Cotton × Bamboo brand — and it's amazing.\n\nUse my link to get ₹300 off your first order:\n${referralLink}\n\nHope you love it as much as I do!`
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
    }
  }

  const rewarded = referrals.filter((r) => r.status === "rewarded").length;

  return (
    <div className="grid gap-6">
      {/* Hero card */}
      <div className="overflow-hidden rounded-brand bg-brand-teal text-white">
        <div className="p-7 md:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-sand">
            Referral Programme
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
            Give ₹300.
            <br />
            <em className="font-light italic">Get ₹300.</em>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/80">
            Share your unique link. When a friend places their first order, they save ₹300 — and so do you. No limits on how many friends you refer.
          </p>

          {/* Link copy row */}
          <div className="mt-8 flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1 truncate rounded-full bg-white/15 px-5 py-3 text-sm font-medium">
              {referralLink}
            </div>
            <button
              onClick={handleCopy}
              type="button"
              aria-label="Copy referral link"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white text-brand-teal transition hover:bg-brand-sand"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {/* Share buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`https://wa.me/?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
            >
              <Share2 size={14} />
              Share on WhatsApp
            </a>
            <a
              href={`mailto:?subject=₹300 off The Comfortable Co.&body=${mailtoBody}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <Share2 size={14} />
              Share via Email
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 divide-x divide-white/20 border-t border-white/20 bg-white/10">
          <div className="p-5 text-center">
            <p className="font-display text-3xl font-bold">{referrals.length}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-brand-sand">
              Friends referred
            </p>
          </div>
          <div className="p-5 text-center">
            <p className="font-display text-3xl font-bold">₹{rewarded * 300}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-brand-sand">
              Credits earned
            </p>
          </div>
        </div>
      </div>

      {/* Referral history */}
      {referrals.length > 0 && (
        <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-display text-xl font-semibold">Referral history</h3>
          <div className="mt-4 grid gap-3">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between rounded-brand bg-brand-paper p-4 dark:bg-white/5"
              >
                <div>
                  <p className="text-sm font-semibold text-brand-ink dark:text-white">
                    {ref.referredEmail}
                  </p>
                  <p className="mt-0.5 text-[11px] text-brand-muted">
                    Referred on {new Date(ref.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
                    ref.status === "rewarded"
                      ? "bg-brand-teal/10 text-brand-teal"
                      : "bg-amber-50 text-amber-700"
                  )}
                >
                  {ref.status === "rewarded" ? "✓ Rewarded" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
        <h3 className="font-display text-xl font-semibold">How it works</h3>
        <ol className="mt-5 grid gap-4">
          {[
            ["Share your link", "Send your unique link to friends, family, or followers."],
            ["Friend places first order", "When they use your link and complete a purchase, you both get rewarded."],
            ["Both earn ₹300", "Credits are added to both accounts within 24 hours of their order."],
          ].map(([title, desc], i) => (
            <li key={title} className="flex gap-4">
              <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[13px] font-bold text-brand-teal">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-ink dark:text-white">{title}</p>
                <p className="mt-1 text-sm text-brand-muted dark:text-white/60">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
