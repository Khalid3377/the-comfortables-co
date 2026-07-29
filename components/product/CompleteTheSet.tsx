"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useCommerceStore } from "@/store/commerce-store";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";

export interface RecommendationItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface CompleteTheSetProps {
  productId: string;
  maxItems?: number;
  compact?: boolean;
  className?: string;
  products?: Product[];
}

function CompleteTheSetSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: compact ? 3 : 4 }).map((_, index) => (
        <div key={index} className="w-36 shrink-0 snap-start">
          <Skeleton className="aspect-[4/5] w-full rounded-brand" />
          <Skeleton className="mt-2 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

function CompleteTheSetContent({ productId, maxItems = 4, compact = false, className, products = [] }: CompleteTheSetProps) {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCommerceStore((state) => state.addToCart);

  useEffect(() => {
    let active = true;

    async function loadRecommendations() {
      try {
        const response = await fetch(
          `/api/recommendations?productId=${encodeURIComponent(productId)}&limit=${maxItems}`
        );
        if (!response.ok) throw new Error("Failed to load recommendations");
        const data = (await response.json()) as { recommendations: RecommendationItem[] };
        if (active) setItems(data.recommendations);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRecommendations();

    return () => {
      active = false;
    };
  }, [productId, maxItems]);

  const handleAdd = (slug: string) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    addToCart({
      slug,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]
    });
  };

  if (loading) {
    return (
      <section className={className}>
        <h3 className="font-display text-[22px] font-bold text-brand-ink dark:text-white">Complete the set</h3>
        <div className="mt-4">
          <CompleteTheSetSkeleton compact={compact} />
        </div>
      </section>
    );
  }

  if (!items.length) return null;

  return (
    <section className={className}>
      <h3 className="font-display text-[22px] font-bold text-brand-ink dark:text-white">Complete the set</h3>
      <div
        className={cn(
          "mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          compact && "gap-2"
        )}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className={cn("w-36 shrink-0 snap-start", compact && "w-32")}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-brand bg-brand-sand/20">
              <Image
                src={item.image}
                alt={item.name}
                width={144}
                height={180}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label={`Add ${item.name} to cart`}
                onClick={() => handleAdd(item.slug)}
                className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-brand-teal text-white transition hover:bg-brand-teal-light"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-brand-ink dark:text-white">
              {item.name}
            </p>
            <p className="mt-1 text-xs font-bold text-brand-teal">{formatCurrency(item.price)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CompleteTheSet(props: CompleteTheSetProps) {
  return (
    <ErrorBoundary>
      <CompleteTheSetContent {...props} />
    </ErrorBoundary>
  );
}
