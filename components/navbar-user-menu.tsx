"use client";

import { useEffect, useState, useRef } from "react";
import { User, LogOut, Package, Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import SafeImage from "./ui/safe-image";

export function NavbarUserMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Track the last known user ID so we can compare without adding `user`
  // to the effect dependency array (which would cause infinite re-subscriptions).
  const prevUserIdRef = useRef<string | null>(null);
  // Prevent the cart merge from firing more than once per login event.
  const hasMergedRef = useRef(false);
  const router = useRouter();

  // ─── Auth listener — runs exactly ONCE on mount ────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    // Seed initial user without waiting for the subscription to fire
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      prevUserIdRef.current = data.user?.id ?? null;
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const newUser = session?.user ?? null;
        const newId  = newUser?.id ?? null;

        // ── Guard: only update state when the user identity actually changed ──
        if (newId === prevUserIdRef.current) return;

        prevUserIdRef.current = newId;
        setUser(newUser);

        // ── Cart & Wishlist merge: only on a fresh login (null → user) ──────────────────
        const wasGuest = prevUserIdRef.current === null;
        if (newUser && !hasMergedRef.current) {
          hasMergedRef.current = true;  // prevent re-entry on rapid events
          try {
            // 1. Hydrate Wishlist
            if (newUser.user_metadata?.wishlist) {
              const { useCommerceStore } = await import("@/store/commerce-store");
              useCommerceStore.getState().setWishlist(newUser.user_metadata.wishlist);
            }

            // 2. Merge Cart
            const localCart = JSON.parse(
              localStorage.getItem("comfortable-commerce") || "{}"
            );
            const items: any[] = localCart?.state?.cart ?? [];
            if (items.length > 0) {
              const { mergeLocalCart } = await import("@/lib/actions/cart");
              const { useCommerceStore } = await import("@/store/commerce-store");
              await mergeLocalCart(
                items.map((i) => ({
                  productId: i.slug,
                  quantity: i.quantity,
                  size: i.size,
                  color: i.color,
                }))
              );
              useCommerceStore.getState().clearCart();
            }
          } catch (err) {
            console.error("Data merge failed:", err);
            hasMergedRef.current = false; // allow retry on next event
          }
        }

        // Reset merge flag when user logs out so next login re-merges
        if (!newUser) {
          hasMergedRef.current = false;
        }
      }
    );

    return () => { subscription.unsubscribe(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← EMPTY array: listener is set up exactly once, never torn down on user state changes

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-5 w-5 animate-pulse rounded-full bg-[#EAEAEA]" />;
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="text-[#2B2B2B] dark:text-[#FAFAF7]/90 hover:text-[#2E6F68] transition-colors"
        aria-label="Login"
      >
        <User size={20} />
      </Link>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const initials = (user.user_metadata?.full_name || user.email || "?")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[#EAEAEA] bg-[#F0F7F5] transition-transform hover:scale-105"
      >
        {avatarUrl ? (
          <SafeImage
            src={avatarUrl}
            alt="User avatar"
            fill
            sizes="32px"
            className="object-cover"
          />
        ) : (
          <span className="text-[11px] font-bold text-[#2E6F68]">{initials}</span>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#EAEAEA] bg-white shadow-lg z-[100] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#EAEAEA]">
            <p className="text-[13px] font-bold text-[#2B2B2B] truncate">
              {user.user_metadata?.full_name || "Customer"}
            </p>
            <p className="text-[11px] text-[#6E6E6E] truncate">{user.email}</p>
          </div>
          <div className="p-2">
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[#2B2B2B] hover:bg-[#FAFAF7] hover:text-[#2E6F68] transition-colors"
            >
              <User size={15} /> My Account
            </Link>
            <Link
              href="/account?tab=My+Orders" // Using query param conceptually, though not implemented; it maps conceptually.
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[#2B2B2B] hover:bg-[#FAFAF7] hover:text-[#2E6F68] transition-colors"
            >
              <Package size={15} /> My Orders
            </Link>
            <Link
              href="/account?tab=Wishlist" // conceptually
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[#2B2B2B] hover:bg-[#FAFAF7] hover:text-[#2E6F68] transition-colors"
            >
              <Heart size={15} /> Wishlist
            </Link>
            <div className="my-1 h-[1px] bg-[#EAEAEA]" />
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
