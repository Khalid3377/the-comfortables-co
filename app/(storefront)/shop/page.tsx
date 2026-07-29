import type { Metadata } from "next";
import { Filter } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Shop", description: "Shop premium Cotton x Bamboo comfort wear." };

export default async function ShopPage() {
  const products = await getProducts({ publishedOnly: true });
  const categoriesList = await getCategories();
  const categoryNames = categoriesList.map((c) => c.name);

  return (
    <section className="container-page py-16">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-teal">Shop</p>
          <h1 className="mt-3 font-display text-6xl font-semibold">Comfort wear, refined.</h1>
        </div>
        <div className="flex items-center gap-2 rounded-brand border border-brand-border bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
          <Filter size={18} />
          <select className="bg-transparent text-sm outline-none">
            <option>Newest</option>
            <option>Popular</option>
            <option>Best Selling</option>
            <option>Price</option>
          </select>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-brand border border-brand-border bg-white p-5 dark:border-white/10 dark:bg-white/5">
          {["Category", "Size", "Color", "Collection", "Price", "Material"].map((filter) => (
            <div key={filter} className="border-b border-brand-border py-5 last:border-b-0 dark:border-white/10">
              <p className="font-semibold">{filter}</p>
              <div className="mt-3 grid gap-2 text-sm text-brand-muted dark:text-white/70">
                {(filter === "Category" ? categoryNames : ["All", "Cotton x Bamboo", "Core", "Premium"]).map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-brand-teal" /> {item}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </aside>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
