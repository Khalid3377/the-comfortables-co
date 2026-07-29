import type { Metadata } from "next";
import { ReferralHub } from "@/components/account/ReferralHub";

export const metadata: Metadata = {
  title: "Referrals",
  description: "Refer friends and earn ₹300 for every successful referral with The Comfortable Co."
};

export default function ReferralsPage() {
  return (
    <section className="container-page py-16">
      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-teal">
        Refer & Earn
      </div>
      <h1 className="font-display text-6xl font-semibold leading-tight">
        Give ₹300, Get ₹300.
      </h1>
      <p className="mt-3 max-w-xl text-base text-brand-muted dark:text-white/70">
        Share The Comfortable Co. with someone who deserves a little more comfort in their life. You both win.
      </p>

      <div className="mt-10 max-w-4xl">
        <ReferralHub />
      </div>
    </section>
  );
}
