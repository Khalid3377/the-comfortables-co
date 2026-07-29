import { getCategories } from "@/lib/data/categories";
import { getProducts } from "@/lib/data/products";
import { CategoriesClient } from "./categories-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Categories Management | The Comfortable Co.",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const products = await getProducts();
  return <CategoriesClient categories={categories} products={products} />;
}
