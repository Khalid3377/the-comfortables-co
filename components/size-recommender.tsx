"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  height: z.coerce.number().min(120).max(220),
  weight: z.coerce.number().min(35).max(160),
  bodyType: z.string().min(1),
  fit: z.string().min(1)
});

type FormValues = z.infer<typeof schema>;

export function SizeRecommender() {
  const [result, setResult] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { height: 170, weight: 68, bodyType: "balanced", fit: "regular" }
  });

  const helper = useMemo(() => "Based on body proportions, preferred drape, and Cotton x Bamboo stretch recovery.", []);

  function recommend(values: FormValues) {
    let score = values.weight / Math.pow(values.height / 100, 2);
    if (values.fit === "relaxed") score += 1.2;
    if (values.fit === "close") score -= 1;
    if (values.bodyType === "curvy" || values.bodyType === "broad") score += 0.8;
    const size = score < 19 ? "S" : score < 23 ? "M" : score < 27 ? "L" : "XL";
    setResult(size);
  }

  return (
    <section className="rounded-brand border border-brand-border bg-white p-6 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-brand bg-brand-teal text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-semibold">AI Size Recommendation</h2>
          <p className="text-sm text-brand-muted dark:text-white/70">{helper}</p>
        </div>
      </div>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(recommend)}>
        <label className="grid gap-2 text-sm font-medium">
          Height in cm
          <input className="h-12 rounded-brand border border-brand-border bg-transparent px-3" type="number" {...register("height")} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Weight in kg
          <input className="h-12 rounded-brand border border-brand-border bg-transparent px-3" type="number" {...register("weight")} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Body type
          <select className="h-12 rounded-brand border border-brand-border bg-transparent px-3" {...register("bodyType")}>
            <option value="balanced">Balanced</option>
            <option value="curvy">Curvy</option>
            <option value="broad">Broad shoulders</option>
            <option value="straight">Straight</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Fit preference
          <select className="h-12 rounded-brand border border-brand-border bg-transparent px-3" {...register("fit")}>
            <option value="regular">Regular</option>
            <option value="relaxed">Relaxed</option>
            <option value="close">Close</option>
          </select>
        </label>
        <button className="h-12 rounded-brand bg-brand-teal px-5 font-semibold text-white md:col-span-2" type="submit">
          Recommend my size
        </button>
      </form>
      {formState.errors.height || formState.errors.weight ? <p className="mt-3 text-sm text-red-600">Enter realistic height and weight values.</p> : null}
      {result ? (
        <div className="mt-5 rounded-brand bg-brand-paper p-5 dark:bg-white/10">
          <p className="text-sm text-brand-muted dark:text-white/70">Recommended size</p>
          <p className="font-display text-5xl font-bold text-brand-teal dark:text-white">{result}</p>
        </div>
      ) : null}
    </section>
  );
}
