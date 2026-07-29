"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCommerceStore } from "@/store/commerce-store";
import { getProducts } from "@/lib/data/products";
import { Product } from "@/lib/types";

export type CartItem = {
  id: string; // Unique composite key: slug-size-color
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
};

type CartContextType = {
  cartItems: CartItem[];
  subtotal: number;
  addToCart: (item: Omit<CartItem, "id" | "name" | "price" | "image">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { cart, addToCart: storeAddToCart, removeFromCart: storeRemoveFromCart, clearCart: storeClearCart } = useCommerceStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Fetch product catalog on mount to resolve name, price, and image
  useEffect(() => {
    async function fetchCatalog() {
      try {
        const response = await fetch("/api/recommendations"); // endpoint to get products or load directly
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          // Fallback fetch if API fails
          const res = await fetch("/api/ugc");
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error("Failed to load catalog in CartProvider:", e);
      }
    }
    fetchCatalog();
  }, []);

  // Map simple Zustand cart to fully resolved CartItem array
  useEffect(() => {
    const resolved = cart
      .map((item) => {
        const product = products.find((p) => p.slug === item.slug);
        if (!product) return null;
        return {
          id: `${item.slug}-${item.size || "default"}-${item.color || "default"}`,
          slug: item.slug,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: product.image,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    setCartItems(resolved);
  }, [cart, products]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, "id" | "name" | "price" | "image">) => {
    storeAddToCart({
      slug: newItem.slug,
      quantity: newItem.quantity,
      size: newItem.size,
      color: newItem.color,
    });
  };

  const removeFromCart = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      storeRemoveFromCart(item.slug);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    // Modify Zustand store items directly
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    if (quantity <= 0) {
      storeRemoveFromCart(item.slug);
      return;
    }

    useCommerceStore.setState((state) => ({
      cart: state.cart.map((entry) =>
        entry.slug === item.slug && entry.size === item.size && entry.color === item.color
          ? { ...entry, quantity }
          : entry
      ),
    }));
  };

  const clearCart = () => {
    storeClearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
