"use client";

import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";
import { useCommerceStore } from "@/store/commerce-store";

export function WishlistClient({ products = [] }: { products?: Product[] }) {
  const wishlist = useCommerceStore((state) => state.wishlist);
  const wished = products.filter((product) => wishlist.includes(product.slug));

  return (
    <section className="container-page py-16">
      <h1 className="font-display text-6xl font-semibold">Wishlist</h1>
      {wished.length ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {wished.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <p className="mt-6 text-brand-muted dark:text-white/70">Your wishlist is empty. Save pieces from the shop to find them here.</p>
      )}
    </section>
  );
}
