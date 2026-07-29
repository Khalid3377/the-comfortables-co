import { Leaf, RotateCcw, Truck } from "lucide-react";

const trustItems = [
  { icon: Truck, label: "Free shipping over ₹1,499" },
  { icon: RotateCcw, label: "30-day returns" },
  { icon: Leaf, label: "OEKO-TEX® certified" }
] as const;

export function TrustBar() {
  return (
    <div
      className="mt-4 rounded-xl border border-[#EAEAEA] bg-[#FAFAF7] p-4 dark:border-white/10 dark:bg-white/5"
      role="list"
      aria-label="Purchase guarantees"
    >
      <div className="grid grid-cols-3 gap-2">
        {trustItems.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5" role="listitem">
            <Icon size={14} className="shrink-0 text-brand-muted" aria-hidden="true" />
            <span className="text-[12px] leading-snug text-brand-muted dark:text-white/60">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
