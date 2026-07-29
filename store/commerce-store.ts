"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addToCart as serverAddToCart, removeFromCart as serverRemoveFromCart, updateCartQuantity as serverUpdateQuantity } from "@/lib/actions/cart";
import { createClient } from "@/lib/supabase/client";

export type CartItem = {
  id?: string; // from DB
  slug: string;
  quantity: number;
  size?: string;
  color?: string;
};

type CommerceState = {
  cart: CartItem[];
  wishlist: string[];
  setCart: (cart: CartItem[]) => void;
  setWishlist: (wishlist: string[]) => void;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (identifier: string, isDbId?: boolean) => Promise<void>;
  updateQuantity: (identifier: string, quantity: number, isDbId?: boolean) => Promise<void>;
  toggleWishlist: (slug: string) => void;
  clearCart: () => void;
};

export const useCommerceStore = create<CommerceState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      setCart: (cart) => set({ cart }),
      setWishlist: (wishlist) => set({ wishlist }),
      
      addToCart: async (item) => {
        // Try server action first
        try {
          const result = await serverAddToCart(item.slug, item.quantity, item.size, item.color);
          
          if (result && !result.useLocal) {
            // Added to DB. To keep UI optimistic, just add to local state too.
            // A page reload or full refresh will sync the real DB ids.
          }
        } catch (e) {
          console.error("Failed to add to server cart", e);
        }

        // Optimistically update local state regardless
        set((state) => {
          const existing = state.cart.find(
            (entry) => entry.slug === item.slug && entry.size === item.size && entry.color === item.color
          );
          if (!existing) return { cart: [...state.cart, item] };
          return {
            cart: state.cart.map((entry) =>
              entry === existing ? { ...entry, quantity: entry.quantity + item.quantity } : entry
            )
          };
        });
      },

      removeFromCart: async (identifier, isDbId = false) => {
        if (isDbId) {
          try { await serverRemoveFromCart(identifier); } catch (e) { console.error(e); }
        }
        set((state) => ({ 
          cart: state.cart.filter((item) => (isDbId ? item.id !== identifier : item.slug !== identifier)) 
        }));
      },

      updateQuantity: async (identifier, quantity, isDbId = false) => {
        if (isDbId) {
          try { await serverUpdateQuantity(identifier, quantity); } catch (e) { console.error(e); }
        }
        set((state) => ({
          cart: state.cart.map((item) => 
            (isDbId ? item.id === identifier : item.slug === identifier) 
              ? { ...item, quantity } 
              : item
          )
        }));
      },

      toggleWishlist: (slug) => {
        set((state) => {
          const newWishlist = state.wishlist.includes(slug)
            ? state.wishlist.filter((item) => item !== slug)
            : [...state.wishlist, slug];
          
          // Async sync to Supabase without blocking UI
          (async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.auth.updateUser({
                data: { wishlist: newWishlist }
              });
            }
          })();

          return { wishlist: newWishlist };
        });
      },
      clearCart: () => set({ cart: [] })
    }),
    { name: "comfortable-commerce" }
  )
);
