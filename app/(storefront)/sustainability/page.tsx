import type { Metadata } from "next";
import { Leaf } from "lucide-react";

export const metadata: Metadata = { title: "Sustainability", description: "Responsible sourcing, ethical production, and lower-waste goals." };

export default function SustainabilityPage() {
  return (
    <section className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Sustainability</p>
      <h1 className="mt-3 max-w-4xl font-display text-6xl font-semibold">A lower-impact path to everyday comfort.</h1>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {["Material sourcing", "Ethical production", "Reduced waste", "Future goals"].map((item) => (
          <article key={item} className="rounded-brand border border-brand-border bg-white p-8 dark:border-white/10 dark:bg-white/5">
            <Leaf className="text-brand-moss" />
            <h2 className="mt-10 font-display text-3xl font-semibold">{item}</h2>
            <p className="mt-4 leading-7 text-brand-muted dark:text-white/70">
              We prioritize traceable partners, durable garments, lean production runs, and packaging decisions that reduce unnecessary waste.
            </p>
          </article>
        ))}
      </div>
      <div className="mt-12 grid gap-4 rounded-brand bg-brand-teal p-8 text-white md:grid-cols-3">
        {["42% less water ambition", "100% recyclable mailers", "2027 circular returns pilot"].map((metric) => (
          <div key={metric} className="rounded-brand border border-white/15 p-5 font-display text-3xl font-semibold">{metric}</div>
        ))}
      </div>
    </section>
  );
}
