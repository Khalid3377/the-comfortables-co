"use client";

import React, { useTransition } from "react";
import { DiscountCode } from "@/lib/types";
import { saveDiscountAction, toggleDiscountAction, deleteDiscountAction } from "./actions";
import { ToggleLeft, ToggleRight, Trash2, Plus, X } from "lucide-react";
import { useState } from "react";

export function DiscountsClient({ discounts }: { discounts: DiscountCode[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState<DiscountCode["type"]>("percentage");
  const [value, setValue] = useState(0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<DiscountCode> = {
      code: code.toUpperCase().replace(/\s+/g, ""),
      type,
      value,
      active: true,
    };
    await saveDiscountAction(null, data);
    setIsAdding(false);
    setCode("");
    setValue(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Discounts &amp; Promos</h1>
          <p className="mt-2 text-brand-muted dark:text-white/60">Create and toggle promo codes for store purchases.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
        >
          <Plus size={16} /> Create Code
        </button>
      </div>

      <div className="rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border dark:border-white/10 bg-brand-paper dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60">
              <th className="p-4">Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Value</th>
              <th className="p-4 text-center">Active</th>
              <th className="p-4 text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border dark:divide-white/10 text-sm">
            {discounts.map((discount) => (
              <tr key={discount.code} className="hover:bg-brand-paper/50 dark:hover:bg-white/5 transition">
                <td className="p-4 font-mono font-bold text-base tracking-wider">{discount.code}</td>
                <td className="p-4 text-brand-muted dark:text-white/60 capitalize">{discount.type}</td>
                <td className="p-4 font-semibold">
                  {discount.type === "percentage" ? `${discount.value}%` : `₹${discount.value}`}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => startTransition(() => { toggleDiscountAction(discount.code, discount.active); })}
                    disabled={isPending}
                    className="disabled:opacity-60"
                  >
                    {discount.active ? (
                      <ToggleRight className="text-brand-teal w-10 h-10" />
                    ) : (
                      <ToggleLeft className="text-brand-muted w-10 h-10" />
                    )}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      if (confirm(`Delete coupon ${discount.code}?`)) {
                        startTransition(() => { deleteDiscountAction(discount.code); });
                      }
                    }}
                    disabled={isPending}
                    className="p-2 rounded-full hover:bg-red-50 text-brand-muted hover:text-red-600 transition disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Dialog */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900">
            <button
              onClick={() => setIsAdding(false)}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">Create Discount Code</h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COMFORT15"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as DiscountCode["type"])}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none dark:border-white/10 dark:bg-neutral-850"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Value</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border dark:border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-brand-border rounded-full text-sm font-semibold hover:bg-brand-paper dark:border-white/10 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal text-white rounded-full text-sm font-semibold hover:bg-brand-teal-light"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
