import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { CatalogueManager } from "@/components/admin/CatalogueManager";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Loungewear Catalogue | Admin",
};

export default async function CataloguePage() {
  const products = await getProducts();
  const categories = await getCategories();
  return <CatalogueManager products={products} categories={categories} categorySlug="loungewear" categoryName="Loungewear" />;
}
