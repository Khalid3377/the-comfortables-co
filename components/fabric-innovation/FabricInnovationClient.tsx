"use client";

import { useState } from "react";
import { Atom, Droplets, Factory, Layers, Wind, type LucideIcon, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion";
import { motion, AnimatePresence } from "framer-motion";
import { SiteSetting } from "@/lib/types";

const fabricCards: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Layers, title: "Blend", text: "Cotton gives body. Bamboo gives softness and cooling." },
  { Icon: Wind, title: "Airflow", text: "Yarn geometry supports ventilation through long wear." },
  { Icon: Droplets, title: "Moisture", text: "Fibers help move humidity away from the skin." },
  { Icon: Atom, title: "Skin safety", text: "Soft trims and low-friction surfaces reduce irritation." },
  { Icon: Factory, title: "Process", text: "Designed around repeatable quality and responsible production." }
];

export function FabricInnovationClient({ timeline }: { timeline: SiteSetting["sustainabilityTimeline"] }) {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="container-page py-16">
      <Reveal className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Fabric Innovation</p>
        <h1 className="mt-3 font-display text-6xl font-semibold text-brand-ink dark:text-white">
          Cotton familiarity, bamboo intelligence.
        </h1>
        <p className="mt-6 text-lg leading-8 text-brand-muted dark:text-white/70">
          Our blend is engineered for warm climates, sensitive skin, and a wardrobe that must move between home, work, travel, and care.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {fabricCards.map(({ Icon, title, text }) => (
          <Reveal key={title} className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5 transition hover:shadow-sm">
            <Icon className="text-brand-teal" />
            <h2 className="mt-8 font-display text-2xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-brand-muted dark:text-white/70">{text}</p>
          </Reveal>
        ))}
      </div>

      {/* Interactive Lab Timeline */}
      <Reveal className="mt-20">
        <div className="rounded-brand bg-brand-ink p-8 text-white md:p-12 shadow-soft relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-teal/10 blur-[90px] pointer-events-none" />
          
          <h2 className="font-display text-4xl font-semibold flex items-center gap-3">
            <Factory className="text-brand-sand" />
            <span>Interactive manufacturing process</span>
          </h2>
          <p className="text-sm text-white/60 mt-2 max-w-xl">
            Click on each step below to inspect how we spin plant material into premium comfort apparel.
          </p>

          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-5">
            {timeline.map((stepData, index) => (
              <button
                key={stepData.step}
                onClick={() => setActiveStep(index)}
                className={`text-left rounded-brand border p-5 transition-all ${
                  activeStep === index
                    ? "border-brand-sand bg-white/10"
                    : "border-white/10 bg-transparent hover:bg-white/5"
                }`}
                type="button"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-brand-sand">0{index + 1}</span>
                  {activeStep === index && <Sparkles size={12} className="text-brand-sand" />}
                </div>
                <p className="mt-8 font-bold text-lg">{stepData.step}</p>
              </button>
            ))}
          </div>

          {/* Expanded Step Detail Box */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <AnimatePresence mode="wait">
              {timeline[activeStep] && (
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-3xl"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-brand-sand font-bold">
                    Step 0{activeStep + 1} Detailed Story
                  </span>
                  <h3 className="text-2xl font-semibold mt-2 font-display text-white">
                    {timeline[activeStep].title}
                  </h3>
                  <p className="mt-4 text-white/70 leading-8 text-base">
                    {timeline[activeStep].desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
