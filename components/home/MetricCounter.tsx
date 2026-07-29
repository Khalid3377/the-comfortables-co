"use client";

import { useEffect, useRef, useState } from "react";

interface MetricItem {
  prefix?: string;
  value: number;
  suffix: string;
  decimals?: number;
  label: string;
}

const METRICS: MetricItem[] = [
  { value: 3, suffix: "×", label: "More breathable than\nregular cotton" },
  { value: 30, suffix: " days", label: "Risk-free trial to feel\nthe comfort yourself" },
  { value: 4.9, suffix: "★", decimals: 1, label: "Average product rating\nacross all items" },
  { value: 90, suffix: "%", label: "Less water used vs\nconventional cotton production" },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, decimals: number = 0, duration: number = 1800, active: boolean = false) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [active, target, decimals, duration]);

  return count;
}

function MetricColumn({ item, active, index }: { item: MetricItem; active: boolean; index: number }) {
  const count = useCountUp(item.value, item.decimals ?? 0, 1800, active);

  return (
    <div
      className={`flex flex-col items-center justify-center px-8 py-10 text-center
        ${index < METRICS.length - 1 ? "border-b border-[#333] md:border-b-0 md:border-r" : ""}
      `}
    >
      <span
        className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-none text-white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {item.decimals ? count.toFixed(item.decimals) : Math.floor(count)}
        <span className="text-brand-sand">{item.suffix}</span>
      </span>
      <p className="mt-4 max-w-[180px] text-sm font-light leading-6 text-[#888] whitespace-pre-line">
        {item.label}
      </p>
    </div>
  );
}

export function MetricCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#2B2B2B]"
      aria-label="Brand metrics"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-4 md:divide-x-0">
          {METRICS.map((item, i) => (
            <MetricColumn key={item.label} item={item} active={active} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
