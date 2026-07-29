"use client";

import { ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";
import { Product } from "@/lib/types";
import { getSizeStock, getVariantId, isSizeSoldOut } from "@/lib/inventory";
import { useCommerceStore } from "@/store/commerce-store";
import { TrustBar } from "@/components/product/TrustBar";
import { StickyCartBar } from "@/components/product/StickyCartBar";
import { StockSignal } from "@/components/product/StockSignal";
import { BackInStock } from "@/components/product/BackInStock";
import { SizeQuiz } from "@/components/product/SizeQuiz";

export function AddToCartPanel({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const addToCart = useCommerceStore((state) => state.addToCart);

  const selectedStock = getSizeStock(product, size);
  const canAddToCart = !isSizeSoldOut(selectedStock);

  const handleAddToCart = () => {
    if (!canAddToCart) return;
    addToCart({ slug: product.slug, quantity: 1, size, color });
  };

  return (
    <>
      <div className="mt-6 rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <p className="font-semibold">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((item) => {
            const stock = getSizeStock(product, item);
            const soldOut = isSizeSoldOut(stock);

            if (soldOut) {
              return (
                <BackInStock
                  key={item}
                  productId={product.slug}
                  variantId={getVariantId(product.slug, item)}
                  size={item}
                />
              );
            }

            return (
              <button
                key={item}
                className={`h-10 min-w-12 rounded-brand border px-3 text-sm ${
                  size === item
                    ? "border-brand-teal bg-brand-teal text-white"
                    : "border-brand-border"
                }`}
                onClick={() => setSize(item)}
                type="button"
              >
                {item}
              </button>
            );
          })}
        </div>

        <StockSignal size={size} stock={selectedStock} variant="pdp" className="mt-3" />

        <SizeQuiz />

        <p className="mt-5 font-semibold">Color</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((item) => (
            <button
              key={item}
              className={`h-10 rounded-brand border px-3 text-sm ${
                color === item
                  ? "border-brand-teal bg-brand-paper text-brand-teal"
                  : "border-brand-border"
              }`}
              onClick={() => setColor(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <button
          ref={addToCartRef}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-brand bg-brand-teal font-semibold text-white transition-colors duration-200 hover:bg-brand-teal-light disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          type="button"
        >
          <ShoppingBag size={18} /> Add to cart
        </button>
        <TrustBar />
      </div>

      <StickyCartBar
        productName={product.name}
        price={product.price}
        onAddToCart={handleAddToCart}
        addToCartButtonRef={addToCartRef}
      />
    </>
  );
}
