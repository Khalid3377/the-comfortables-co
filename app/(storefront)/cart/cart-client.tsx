"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCommerceStore } from "@/store/commerce-store";
import { ComfortCredits } from "@/components/loyalty/ComfortCredits";
import { CompleteTheSet } from "@/components/product/CompleteTheSet";

import { CartItem } from "@/store/commerce-store";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const FREE_SHIPPING_THRESHOLD = 1499;

export function CartClient({ products = [], initialDbCart }: { products?: Product[], initialDbCart?: CartItem[] }) {
  const { cart, setCart, removeFromCart, updateQuantity } = useCommerceStore();
  const router = useRouter();
  
  useEffect(() => {
    if (initialDbCart) {
      setCart(initialDbCart);
    }
  }, [initialDbCart, setCart]);
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");

  const rows = cart
    .map((item) => ({ ...item, product: products.find((p) => p.slug === item.slug) }))
    .filter((row) => row.product);

  const subtotal = rows.reduce((sum, row) => sum + (row.product?.price ?? 0) * row.quantity, 0);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progressPct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  // Points earned on this order (10 per ₹100)
  const pointsEarned = Math.floor(subtotal / 100) * 10;

  // For CompleteTheSet — use the last item in cart or first product
  const lastSlug = rows[rows.length - 1]?.slug ?? products[0].slug;

  return (
    <section className="container-page py-16">
      <h1 className="font-display text-6xl font-semibold">Cart</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* ─── Left: Items ──────────────────────────────────────────── */}
        <div className="grid gap-4">
          {rows.length ? (
            rows.map((row) => (
              <div
                key={`${row.slug}-${row.size}-${row.color}`}
                className="flex gap-4 rounded-brand border border-brand-border bg-white p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-brand">
                  <Image src={row.product!.image} alt={row.product!.name} fill className="object-cover" />
                </div>
                <div className="flex flex-1 justify-between gap-4">
                  <div>
                    <p className="font-semibold">{row.product!.name}</p>
                    <p className="mt-1 text-sm text-brand-muted dark:text-white/70">
                      {row.size} · {row.color}
                    </p>
                    
                    {/* Quantity Selector */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded border border-brand-border px-2 py-1">
                        <button
                          type="button"
                          className="px-2 text-brand-muted hover:text-brand-ink disabled:opacity-50"
                          disabled={row.quantity <= 1}
                          onClick={() => updateQuantity(row.id || row.slug, row.quantity - 1, !!row.id)}
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{row.quantity}</span>
                        <button
                          type="button"
                          className="px-2 text-brand-muted hover:text-brand-ink"
                          onClick={() => updateQuantity(row.id || row.slug, row.quantity + 1, !!row.id)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm text-red-500 hover:underline"
                        onClick={() => removeFromCart(row.id || row.slug, !!row.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(row.product!.price * row.quantity)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <ShoppingBag size={40} className="text-brand-border" />
              <p className="text-brand-muted dark:text-white/70">Your cart is empty.</p>
              <Link href="/shop" className="rounded-full bg-brand-teal px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal-light transition">
                Browse Collection
              </Link>
            </div>
          )}
        </div>

        {/* ─── Right: Summary ───────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Free shipping progress */}
          <div className="rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5">
            {remaining > 0 ? (
              <p className="mb-3 text-sm font-medium text-brand-ink dark:text-white">
                You&apos;re <strong>{formatCurrency(remaining)}</strong> away from free shipping
              </p>
            ) : (
              <p className="mb-3 text-sm font-semibold text-brand-teal">
                🎉 You&apos;ve unlocked free shipping!
              </p>
            )}
            <div className="h-2 w-full overflow-hidden rounded-full bg-brand-border dark:bg-white/10">
              <div
                className="h-full rounded-full bg-brand-teal transition-all duration-700 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-semibold text-brand-muted">
              <span>₹0</span>
              <span>₹{FREE_SHIPPING_THRESHOLD.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Order summary */}
          <aside className="rounded-brand border border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-3xl font-semibold">Order summary</h2>
            <div className="mt-5 flex justify-between text-sm">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Shipping</span>
              <span className={remaining === 0 ? "text-brand-teal font-semibold" : "text-brand-muted"}>
                {remaining === 0 ? "Free" : formatCurrency(60)}
              </span>
            </div>
            <p className="mt-3 text-xs text-brand-muted dark:text-white/60">
              Taxes calculated at checkout.
            </p>

            {/* Gift note */}
            <button
              className="mt-5 flex w-full items-center justify-between text-sm font-semibold text-brand-ink dark:text-white"
              onClick={() => setGiftNoteOpen((o) => !o)}
              type="button"
            >
              <span>🎁 Add a gift message</span>
              {giftNoteOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {giftNoteOpen && (
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Write your message here..."
                rows={3}
                className="mt-3 w-full resize-none rounded-brand border border-brand-border bg-brand-paper px-4 py-3 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
              />
            )}

            <button
              onClick={async () => {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  router.push("/checkout");
                } else {
                  router.push("/auth/login?next=/checkout");
                }
              }}
              className="mt-6 flex w-full h-[52px] items-center justify-center rounded-full bg-brand-teal text-base font-bold text-white transition hover:bg-brand-teal-light"
            >
              Proceed to Checkout &rarr;
            </button>
          </aside>

          {/* Comfort Credits on this order */}
          {rows.length > 0 && (
            <div className="rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5">
              <p className="mb-3 text-sm font-semibold text-brand-ink dark:text-white">
                You&apos;ll earn{" "}
                <span className="text-brand-teal">{pointsEarned} Comfort Credits</span> on this order
              </p>
              <ComfortCredits compact />
            </div>
          )}

          {/* Complete the Set */}
          {rows.length > 0 && (
            <CompleteTheSet productId={lastSlug} maxItems={3} className="rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5" />
          )}
        </div>
      </div>
    </section>
  );
}
