import type { Product } from "@/lib/data";

export const LOW_SIZE_STOCK_THRESHOLD = 5;
export const LOW_PRODUCT_STOCK_THRESHOLD = 10;

export function getSizeStock(product: Product, size: string): number {
  return product.stockBySize[size] ?? 0;
}

export function getTotalStock(product: Product): number {
  return Object.values(product.stockBySize).reduce((sum, count) => sum + count, 0);
}

export function isSizeLowStock(stock: number): boolean {
  return stock > 0 && stock < LOW_SIZE_STOCK_THRESHOLD;
}

export function isProductLowStock(product: Product): boolean {
  return getTotalStock(product) < LOW_PRODUCT_STOCK_THRESHOLD;
}

export function isSizeSoldOut(stock: number): boolean {
  return stock <= 0;
}

export function getVariantId(productId: string, size: string): string {
  return `${productId}-${size}`;
}
