"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useCommerceStore } from "@/store/commerce-store";
import { formatCurrency } from "@/lib/utils";
import { ComfortCredits } from "@/components/loyalty/ComfortCredits";
import { CompleteTheSet } from "@/components/product/CompleteTheSet";
import { NavbarUserMenu } from "./navbar-user-menu";
import { Product } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Custom Leaf SVG Icon matching the description
const LeafIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-[#2E6F68]"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.2a7 7 0 0 1-9 8.8Z" />
    <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
  </svg>
);

const navLinks = [
  { href: "/new-in", label: "New In", subtitle: "Fresh arrivals" },
  { href: "/men", label: "Men", subtitle: "Everyday comfort" },
  { href: "/women", label: "Women", subtitle: "Comfort & elegance" },
  { href: "/maternity", label: "Maternity", subtitle: "Every stage" },
  { href: "/baby-kids", label: "Baby & Kids", subtitle: "Softest touch" },
  { href: "/loungewear", label: "Loungewear", subtitle: "Relax in style" },
  { href: "/sustainability", label: "Sustainability", subtitle: "Our promise" },
  { href: "/about", label: "About Us", subtitle: "Our story" }
];

export function Navbar({ products = [] }: { products?: Product[] }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Dialog and drawer states
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Store data
  const cartItems = useCommerceStore((state) => state.cart);
  const removeFromCart = useCommerceStore((state) => state.removeFromCart);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  };

  // Safe counts to prevent hydration mismatch
  const cartCount = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistCount = mounted ? useCommerceStore.getState().wishlist.length : 0;

  // Cart logic
  const rows = cartItems
    .map((item) => ({
      ...item,
      product: products.find((p) => p.slug === item.slug)
    }))
    .filter((row) => row.product);

  const subtotal = rows.reduce((sum, row) => sum + (row.product?.price || 0) * row.quantity, 0);

  const isScrolled = scrollY > 10;

  return (
    <>
      <div
        className={`relative z-50 w-full transition-all duration-300 bg-[#FAFAF7] dark:bg-[#171a19] border-b border-[#EAEAEA] dark:border-neutral-800 ${
          isScrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : ""
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center">
            <Link href="/" className="relative flex items-center shrink-0 h-16 w-20 sm:w-24">
              <Image 
                src="/logo.jpeg" 
                alt="The Comfortables Co. Logo" 
                fill
                priority
                unoptimized
                className="object-contain mix-blend-multiply dark:mix-blend-normal"
              />
            </Link>
          </div>

          {/* CENTER — Navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex h-full items-center text-[14px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[#2E6F68]"
                      : "text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68]"
                  }`}
                >
                  {link.label}
                  {/* Sliding Underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] bg-[#2E6F68] transition-all duration-200 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT — Icon strip */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors hidden md:block"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Account */}
            <div className="hidden md:block">
              <NavbarUserMenu />
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors hidden md:block"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2E6F68] px-1 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart - Keep visible on mobile, hide other icons */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2E6F68] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors hidden md:block"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors md:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

        </div>
      </div>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto mt-20 max-w-2xl rounded-[8px] bg-[#FAFAF7] dark:bg-[#202522] p-5 shadow-lg border border-[#EAEAEA] dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <Search className="text-[#2E6F68]" />
              <input
                autoFocus
                className="h-12 flex-1 bg-transparent text-xl outline-none text-[#2B2B2B] dark:text-[#FAFAF7]"
                placeholder="Search tees, lounge, baby, maternity"
              />
              <button
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                type="button"
                className="text-[#2B2B2B] dark:text-[#FAFAF7]"
              >
                <X />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer (Left Slide-in) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 top-0 z-[100] flex h-screen w-[300px] flex-col bg-[#FAFAF7] dark:bg-[#171a19] shadow-2xl p-6 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 group">
                  <LeafIcon />
                  <span className="font-display text-[18px] font-bold tracking-tight text-[#2B2B2B] dark:text-[#FAFAF7]">
                    The Comfortables Co.
                  </span>
                </Link>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#2B2B2B] dark:text-[#FAFAF7] hover:text-[#2E6F68] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Stacked Nav Links */}
              <div className="flex flex-col gap-6 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex flex-col"
                  >
                    <span className="text-[18px] font-display font-semibold text-[#2B2B2B] dark:text-[#FAFAF7] group-hover:text-[#2E6F68] transition-colors">
                      {link.label}
                    </span>
                    <span className="text-[12px] text-[#6E6E6E] dark:text-neutral-400 mt-0.5">
                      {link.subtitle}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-[#EAEAEA] dark:bg-neutral-800 my-6" />

              {/* Bottom Icon Row */}
              <div className="flex items-center justify-around py-2">
                {/* Search */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                {/* Account */}
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors"
                  aria-label="Account"
                >
                  <User size={20} />
                </Link>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2E6F68] px-1 text-[10px] font-bold text-white">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCartOpen(true);
                  }}
                  className="relative text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors"
                  aria-label="Cart"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#2E6F68] px-1 text-[10px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 right-0 top-0 z-[80] flex h-screen w-full flex-col border-l border-[#EAEAEA] bg-[#FAFAF7] shadow-2xl dark:border-white/10 dark:bg-[#171a19] sm:max-w-md"
            >
              <div className="flex items-center justify-between border-b border-[#EAEAEA] px-6 py-5 dark:border-white/10">
                <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-[#2B2B2B] dark:text-white">
                  <ShoppingBag size={20} className="text-[#2E6F68]" />
                  <span>Your Cart ({cartCount})</span>
                </h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#EAEAEA] bg-white shadow-sm transition hover:scale-105 dark:border-white/10 dark:bg-white/5"
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
                        className="flex gap-4 rounded-[8px] border border-[#EAEAEA] bg-white p-4 transition hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[8px] bg-neutral-100">
                          {row.product && (
                            <Image
                              src={row.product.image}
                              alt={row.product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="line-clamp-1 text-sm font-bold leading-tight text-[#2B2B2B] dark:text-white">
                              {row.product!.name}
                            </h4>
                            <p className="mt-1 text-xs text-[#6E6E6E] dark:text-white/60">
                              {row.size} · {row.color}
                            </p>
                            <p className="mt-0.5 text-xs text-[#6E6E6E] dark:text-white/60">
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
                            <span className="text-sm font-bold text-[#2B2B2B] dark:text-white">
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
                        className="sticky bottom-0 border-t border-[#EAEAEA] bg-[#FAFAF7] pt-4 dark:border-white/10 dark:bg-[#171a19]"
                      />
                    ) : null}
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag size={48} className="text-[#EAEAEA] dark:text-white/10" />
                    <p className="mt-4 text-[#6E6E6E] dark:text-white/60">Your cart is empty.</p>
                    <Link
                      href="/shop"
                      onClick={() => setCartOpen(false)}
                      className="mt-6 inline-flex h-11 items-center rounded-full bg-[#2E6F68] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#3a8a82]"
                    >
                      Shop Collection
                    </Link>
                  </div>
                )}
              </div>

              {rows.length > 0 && (
                <div className="border-t border-[#EAEAEA] bg-white p-6 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-sm font-medium text-[#6E6E6E] dark:text-white/70">Subtotal</span>
                    <span className="text-2xl font-bold text-[#2E6F68] dark:text-white">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <p className="mb-6 text-xs text-[#6E6E6E] dark:text-white/60">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="grid gap-3">
                    <Link
                      href="/checkout"
                      onClick={() => setCartOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-[8px] bg-[#2E6F68] font-semibold text-white shadow transition hover:bg-[#3a8a82]"
                    >
                      Checkout
                    </Link>
                    <Link
                      href="/cart"
                      onClick={() => setCartOpen(false)}
                      className="flex h-12 w-full items-center justify-center rounded-[8px] border border-[#EAEAEA] bg-white text-sm font-semibold transition hover:border-[#2E6F68] dark:border-white/10 dark:bg-transparent"
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
