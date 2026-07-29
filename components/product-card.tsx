"use client";

import SafeImage from "@/components/ui/safe-image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useCommerceStore } from "@/store/commerce-store";
import { useState, useEffect } from "react";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useCommerceStore((state) => state.addToCart);
  const toggleWishlist = useCommerceStore((state) => state.toggleWishlist);
  const wished = useCommerceStore((state) => state.wishlist.includes(product.slug));

  const [activeImage, setActiveImage] = useState(product.image);
  const [activeColor, setActiveColor] = useState(product.colors[0]);

  // Update active image when product image changes
  useEffect(() => {
    setActiveImage(product.image);
  }, [product.image]);

  const handleCardClick = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.slug);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Quick Add: default first available size and color
    addToCart({
      slug: product.slug,
      quantity: 1,
      size: product.sizes[0],
      color: activeColor || product.colors[0]
    });
    alert(`Added ${product.name} to cart!`);
  };

  // Badge configuration
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "BESTSELLER":
      case "NEW":
        return "bg-[#2E6F68] text-white";
      case "ECO PICK":
        return "bg-[#6B8E5A] text-white";
      case "SALE":
        return "bg-[#DC2626] text-white";
      default:
        return "bg-[#2B2B2B] text-white";
    }
  };

  // Swatch interaction
  const handleSwatchClick = (e: React.MouseEvent, variant: { name: string; hex: string; image?: string }) => {
    e.stopPropagation();
    setActiveColor(variant.name);
    if (variant.image) {
      setActiveImage(variant.image);
    }
  };

  // Rendering fractional rating stars (e.g. 4.8)
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  
  const renderStar = (index: number) => {
    const diff = rating - index;
    if (diff >= 1) {
      return <span key={index} className="text-[#F59E0B] text-[13px]">★</span>;
    } else if (diff > 0) {
      return (
        <span key={index} className="relative text-[13px] text-neutral-200">
          <span className="absolute top-0 left-0 text-[#F59E0B] overflow-hidden" style={{ width: `${diff * 100}%` }}>
            ★
          </span>
          ★
        </span>
      );
    }
    return <span key={index} className="text-neutral-200 text-[13px]">★</span>;
  };

  const variants = product.colorVariants || [];
  const maxSwatches = 3;
  const visibleVariants = variants.slice(0, maxSwatches);
  const remainingCount = variants.length - maxSwatches;

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-[#EAEAEA] shadow-[0_4px_12px_rgba(0,0,0,0.01)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] cursor-pointer"
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-50">
        
        {/* Product image */}
        <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <SafeImage
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* BADGE */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.5px] uppercase ${getBadgeStyle(product.badge)}`}>
            {product.badge}
          </span>
        )}

        {/* WISHLIST BUTTON */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-neutral-600 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:scale-105 transition-transform"
          aria-label="Wishlist"
        >
          <Heart
            size={16}
            className={wished ? "fill-[#EF4444] text-[#EF4444]" : "text-[#6E6E6E]"}
          />
        </button>

        {/* QUICK ADD BUTTON */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:opacity-0 md:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleQuickAddClick}
            className="flex h-[44px] w-full items-center justify-center rounded-lg bg-[#2B2B2B]/90 text-[12px] font-semibold tracking-[1px] uppercase text-white hover:bg-[#2B2B2B] transition-colors"
          >
            ＋ QUICK ADD
          </button>
        </div>

      </div>

      {/* 2. CARD BODY */}
      <div className="flex flex-col p-4 flex-grow">
        
        {/* Name & Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[15px] font-semibold text-[#2B2B2B] line-clamp-1">
            {product.name}
          </h3>
          <div className="flex flex-col items-end">
            {product.salePrice ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[12px] text-[#9CA3AF] line-through font-medium">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-[15px] font-bold text-[#DC2626]">
                  {formatCurrency(product.salePrice)}
                </span>
              </div>
            ) : (
              <span className="text-[15px] font-bold text-[#2B2B2B]">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Star Rating Row */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => renderStar(i))}
            </div>
            <span className="text-[12px] text-[#6E6E6E] ml-1">
              ({rating.toFixed(1)})
            </span>
            <span className="text-[12px] text-[#6E6E6E]">
              · {reviewCount} reviews
            </span>
          </div>
        )}

        {/* Color Swatches Row */}
        {variants.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            {visibleVariants.map((variant) => {
              const isSelected = activeColor === variant.name;
              return (
                <button
                  key={variant.name}
                  onClick={(e) => handleSwatchClick(e, variant)}
                  className={`h-4 w-4 rounded-full border border-black/10 transition-shadow ${
                    isSelected ? "ring-2 ring-[#2E6F68] ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: variant.hex }}
                  title={variant.name}
                />
              );
            })}
            {remainingCount > 0 && (
              <span className="text-[12px] text-[#6E6E6E] font-medium">
                +{remainingCount}
              </span>
            )}
          </div>
        )}

      </div>

    </article>
  );
}
