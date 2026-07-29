import type { Metadata } from "next";
import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";

export const metadata: Metadata = { title: "Contact", description: "Contact The Comfortables Co." };

const contactItems: { Icon: LucideIcon; text: string }[] = [
  { Icon: Mail, text: "care@thecomfortables.co" },
  { Icon: Phone, text: "+91 98765 43210" },
  { Icon: MapPin, text: "Bengaluru, India" }
];

export default function ContactPage() {
  return (
    <section className="container-page py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Contact</p>
      <h1 className="mt-3 font-display text-6xl font-semibold">How can we help?</h1>
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4">
          {contactItems.map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-3 rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <Icon className="text-brand-teal" />
              <span>{text}</span>
            </div>
          ))}
        </div>
        <form className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="h-12 rounded-brand border border-brand-border bg-transparent px-3" placeholder="Name" />
            <input className="h-12 rounded-brand border border-brand-border bg-transparent px-3" placeholder="Email" />
          </div>
          <input className="mt-4 h-12 w-full rounded-brand border border-brand-border bg-transparent px-3" placeholder="Subject" />
          <textarea className="mt-4 min-h-36 w-full rounded-brand border border-brand-border bg-transparent p-3" placeholder="Message" />
          <button className="mt-4 h-12 rounded-brand bg-brand-teal px-6 font-semibold text-white" type="button">Send message</button>
        </form>
      </div>
    </section>
  );
}
