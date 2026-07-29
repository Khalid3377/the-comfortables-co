"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useCommerceStore } from "@/store/commerce-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ComfortCredits } from "@/components/loyalty/ComfortCredits";
import { CompleteTheSet } from "@/components/product/CompleteTheSet";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion
} from "framer-motion";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/fabric-innovation", label: "Fabric" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" }
];

export function Navbar({ products = [] }: { products?: Product[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 80);

    if (prefersReducedMotion || latest <= 200) {
      setIsVisible(true);
    } else if (latest > lastScrollY.current) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    lastScrollY.current = latest;
  });

  const cartItems = useCommerceStore((state) => state.cart);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = useCommerceStore((state) => state.wishlist.length);

  const rows = cartItems
    .map((item) => ({
      ...item,
      product: products.find((product) => product.slug === item.slug)
    }))
    .filter((row) => row.product);

  const subtotal = rows.reduce((sum, row) => sum + (row.product?.price || 0) * row.quantity, 0);

  return (
    <>
      <motion.nav
        className={`fixed top-[var(--announcement-bar-height,0px)] left-0 right-0 z-50 will-change-transform transition-[background-color,border-color,transform,backdrop-filter,top] duration-300 motion-reduce:transition-none ${
          isScrolled
            ? "border-b border-[#EAEAEA] bg-[#FAFAF7]/85 backdrop-blur-xl dark:border-white/10 dark:bg-[#171a19]/85"
            : "border-b border-transparent bg-transparent"
        }`}
        animate={{ y: prefersReducedMotion || isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        aria-label="Main navigation"
      >
        <div className="container-page flex h-[74px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-full pr-3 font-display text-lg font-bold tracking-normal text-brand-ink dark:text-white"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-brand-border/80 bg-white p-0.5 shadow-soft transition group-hover:scale-105 dark:border-white/10">
              <Image
                src="/logo.jpg"
                alt="The Comfortables Co. Logo"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
            </div>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.34em] text-brand-teal dark:text-brand-sand">
                The
              </span>
              <span className="-mt-1 block font-display text-base font-bold tracking-tight text-brand-ink dark:text-white">
                Comfortables Co.
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-[11px] font-bold uppercase tracking-[0.34em] text-brand-ink/70 dark:text-white/[0.72] lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-brand-teal dark:hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/account/referrals"
              className="focus-ring mr-2 hidden rounded-full bg-brand-teal px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-teal-light lg:inline-flex"
            >
              Refer & Earn
            </Link>
            <button
              aria-label="Search"
              className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white/72 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal dark:border-white/10 dark:bg-white/10"
              onClick={() => setSearchOpen(true)}
              type="button"
            >
              <Search size={18} />
            </button>
            <Link
              aria-label="Wishlist"
              href="/wishlist"
              className="focus-ring relative grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white/72 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal dark:border-white/10 dark:bg-white/10"
            >
              <Heart size={18} />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-teal px-1 text-xs text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="focus-ring relative grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white/72 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal dark:border-white/10 dark:bg-white/10"
              type="button"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-teal px-1 text-xs text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
            <Link
              aria-label="Account"
              href="/account"
              className="focus-ring hidden h-11 w-11 place-items-center rounded-full border border-brand-border bg-white/72 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-teal dark:border-white/10 dark:bg-white/10 sm:grid"
            >
              <User size={18} />
            </Link>
            <ThemeToggle />
            <button
              aria-label="Open menu"
              className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-brand-border bg-white/72 shadow-sm dark:border-white/10 dark:bg-white/10 lg:hidden"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Spacer so content is not hidden under fixed navbar */}
      <div style={{ height: "calc(74px + var(--announcement-bar-height, 0px))" }} aria-hidden="true" />

      {menuOpen ? (
        <div className="fixed inset-0 z-[60] bg-brand-paper p-6 dark:bg-[#171a19] lg:hidden">
          <div className="mb-10 flex items-center justify-between">
            <span className="font-display text-lg font-bold text-brand-teal dark:text-white">
              THE COMFORTABLES CO.
            </span>
            <button aria-label="Close menu" onClick={() => setMenuOpen(false)} type="button">
              <X />
            </button>
          </div>
          <div className="grid gap-4 text-3xl font-semibold">
            {[...nav, { href: "/account", label: "Account" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/account/referrals"
            onClick={() => setMenuOpen(false)}
            className="mt-10 inline-flex rounded-full bg-brand-teal px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-teal-light"
          >
            Refer & Earn
          </Link>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-[70] bg-brand-ink/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto mt-20 max-w-2xl rounded-brand bg-brand-paper p-5 shadow-soft dark:bg-[#202522]">
            <div className="flex items-center gap-3">
              <Search className="text-brand-teal" />
              <input
                autoFocus
                className="h-12 flex-1 bg-transparent text-xl outline-none"
                placeholder="Search tees, lounge, baby, maternity"
              />
              <button aria-label="Close search" onClick={() => setSearchOpen(false)} type="button">
                <X />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[70] bg-brand-ink/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 right-0 top-0 z-[80] flex h-screen w-full flex-col border-l border-brand-border bg-brand-paper shadow-2xl dark:border-white/10 dark:bg-[#171a19] sm:max-w-md"
            >
              <div className="flex items-center justify-between border-b border-brand-border px-6 py-5 dark:border-white/10">
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
                  <ShoppingBag size={20} className="text-brand-teal" />
                  <span>Your Cart ({cartCount})</span>
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-brand-border bg-white shadow-sm transition hover:scale-105 dark:border-white/10 dark:bg-white/5"
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {rows.length ? (
                  <>
                    {rows.map((row) => (
                      <div
                        key={`${row.slug}-${row.size}-${row.color}`}
                        className="flex gap-4 rounded-brand border border-brand-border bg-white p-4 transition hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-brand bg-brand-sand/10">
                          <Image
                            src={row.product!.image}
                            alt={row.product!.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="line-clamp-1 text-sm font-bold leading-tight text-brand-ink dark:text-white">
                              {row.product!.name}
                            </h4>
                            <p className="mt-1 text-xs text-brand-muted dark:text-white/60">
                              {row.size} · {row.color}
                            </p>
                            <p className="mt-0.5 text-xs text-brand-muted dark:text-white/60">
                              Qty: {row.quantity}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <button
                              onClick={() => removeFromCart(row.slug)}
                              className="text-xs text-red-500 hover:underline"
                              type="button"
                            >
                              Remove
                            </button>
                            <span className="text-sm font-bold text-brand-ink dark:text-white">
                              {formatCurrency(row.product!.price * row.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <ComfortCredits orderTotal={subtotal} compact />

                    {rows[0]?.slug ? (
                      <CompleteTheSet
                        productId={rows[0].slug}
                        maxItems={3}
                        compact
                        className="sticky bottom-0 border-t border-brand-border bg-brand-paper pt-4 dark:border-white/10 dark:bg-[#171a19]"
                      />
                    ) : null}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag size={48} className="text-brand-border dark:text-white/10" />
                    <p className="mt-4 text-brand-muted dark:text-white/60">Your cart is empty.</p>
                    <Link
                      href="/shop"
                      onClick={() => setCartOpen(false)}
                      className="mt-6 inline-flex h-11 items-center rounded-full bg-brand-teal px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-brand-teal-light"
                    >
                      Shop Collection
                    </Link>
                  </div>
                )}
              </div>

              {rows.length > 0 && (
                <div className="border-t border-brand-border bg-white p-6 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-brand-muted dark:text-white/70">Subtotal</span>
                    <span className="text-2xl font-bold text-brand-teal dark:text-white">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <p className="mb-6 text-xs text-brand-muted dark:text-white/60">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="grid gap-3">
                    <Link
                      href="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-brand bg-brand-teal font-semibold text-white shadow-soft transition hover:bg-brand-teal-light"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-brand border border-brand-border bg-white text-sm font-semibold transition hover:border-brand-teal dark:border-white/10 dark:bg-transparent"
                    >
                      View Full Cart
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
