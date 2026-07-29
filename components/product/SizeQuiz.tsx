"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { calculateSize, BodyType, FitPreference, SizeResult } from "@/lib/sizeCalculator";
import { cn } from "@/lib/utils";

const BODY_TYPES: BodyType[] = ["Slim", "Regular", "Athletic", "Plus"];
const FIT_PREFS: FitPreference[] = ["Relaxed", "Regular", "Fitted"];

type Step = 1 | 2 | 3 | "result";

const stepVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

export function SizeQuiz() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState<BodyType | null>(null);
  const [fitPref, setFitPref] = useState<FitPreference | null>(null);
  const [result, setResult] = useState<{ size: SizeResult; confidence: number; note: string } | null>(null);

  function reset() {
    setStep(1);
    setHeight("");
    setWeight("");
    setBodyType(null);
    setFitPref(null);
    setResult(null);
  }

  function handleSubmit() {
    if (!bodyType || !fitPref) return;
    const output = calculateSize({
      heightCm: parseFloat(height),
      weightKg: parseFloat(weight),
      bodyType,
      fitPreference: fitPref,
    });
    setResult(output);
    setStep("result");
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-semibold text-brand-teal underline-offset-4 hover:underline"
        type="button"
      >
        Not sure of your size? Find yours →
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-brand border border-brand-border bg-brand-paper p-6 dark:border-white/10 dark:bg-white/5">
              {/* Progress dots */}
              <div className="mb-6 flex justify-center gap-2">
                {([1, 2, 3] as const).map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      step === s || (step === "result" && s === 3)
                        ? "w-6 bg-brand-teal"
                        : typeof step === "number" && step > s
                        ? "bg-brand-teal/60"
                        : "bg-brand-border"
                    )}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1 — Measurements */}
                {step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <p className="mb-4 text-sm font-semibold text-brand-ink dark:text-white">
                      Step 1 · Your measurements
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                          Height (cm)
                        </label>
                        <input
                          type="number"
                          min={100}
                          max={250}
                          placeholder="e.g. 165"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full rounded-brand border border-brand-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/10"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          min={20}
                          max={200}
                          placeholder="e.g. 60"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full rounded-brand border border-brand-border bg-white px-4 py-3 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/10"
                        />
                      </div>
                    </div>
                    <button
                      disabled={!height || !weight}
                      onClick={() => setStep(2)}
                      className="mt-5 w-full rounded-full bg-brand-teal py-3 text-sm font-semibold text-white transition hover:bg-brand-teal-light disabled:opacity-40"
                      type="button"
                    >
                      Next →
                    </button>
                  </motion.div>
                )}

                {/* Step 2 — Body Type */}
                {step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <p className="mb-4 text-sm font-semibold text-brand-ink dark:text-white">
                      Step 2 · Your body type
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {BODY_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setBodyType(type)}
                          type="button"
                          className={cn(
                            "rounded-full border px-4 py-2.5 text-sm font-semibold transition",
                            bodyType === type
                              ? "border-brand-teal bg-brand-teal text-white"
                              : "border-brand-border bg-white text-brand-ink hover:border-brand-teal dark:border-white/10 dark:bg-white/5 dark:text-white"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button onClick={() => setStep(1)} type="button" className="flex-1 rounded-full border border-brand-border py-3 text-sm font-semibold text-brand-ink dark:border-white/10 dark:text-white">
                        ← Back
                      </button>
                      <button
                        disabled={!bodyType}
                        onClick={() => setStep(3)}
                        type="button"
                        className="flex-1 rounded-full bg-brand-teal py-3 text-sm font-semibold text-white transition hover:bg-brand-teal-light disabled:opacity-40"
                      >
                        Next →
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Fit Preference */}
                {step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <p className="mb-4 text-sm font-semibold text-brand-ink dark:text-white">
                      Step 3 · Fit preference
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {FIT_PREFS.map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setFitPref(pref)}
                          type="button"
                          className={cn(
                            "rounded-full border px-5 py-2.5 text-sm font-semibold transition",
                            fitPref === pref
                              ? "border-brand-teal bg-brand-teal text-white"
                              : "border-brand-border bg-white text-brand-ink hover:border-brand-teal dark:border-white/10 dark:bg-white/5 dark:text-white"
                          )}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button onClick={() => setStep(2)} type="button" className="flex-1 rounded-full border border-brand-border py-3 text-sm font-semibold text-brand-ink dark:border-white/10 dark:text-white">
                        ← Back
                      </button>
                      <button
                        disabled={!fitPref}
                        onClick={handleSubmit}
                        type="button"
                        className="flex-1 rounded-full bg-brand-teal py-3 text-sm font-semibold text-white transition hover:bg-brand-teal-light disabled:opacity-40"
                      >
                        Find my size
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Result */}
                {step === "result" && result && (
                  <motion.div key="result" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand-teal">
                      We recommend
                    </p>
                    <div className="my-4 flex items-center justify-center">
                      <span className="font-display text-[64px] font-bold leading-none text-brand-teal">
                        {result.size}
                      </span>
                    </div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-teal/10 px-4 py-1.5 text-xs font-semibold text-brand-teal">
                      {result.confidence}% confidence
                    </div>
                    <p className="text-sm leading-6 text-brand-muted dark:text-white/70">
                      {result.note}
                    </p>
                    <button
                      onClick={reset}
                      type="button"
                      className="mt-5 text-xs font-semibold text-brand-muted underline-offset-2 hover:underline"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
