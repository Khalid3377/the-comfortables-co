import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { ProductsClient } from "./products-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Products Management | The Comfortable Co.",
};

export default async function AdminProductsPage() {
  const products = await getProducts();
  const categories = await getCategories();
  return <ProductsClient products={products} categories={categories} />;
}
