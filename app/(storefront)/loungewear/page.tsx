import { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import CategoryPageClient from "@/components/category/CategoryPageClient";
import { Cloud, Wind, Maximize, Sun } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Loungewear | The Comfortables Co.",
  description: "Browse our premium ultra-soft Cotton × Bamboo loungewear sets, lounge pants, relaxed tees, and robes designed for daily comfort."
};

export default async function LoungewearPage() {
  const products = await getProducts({ publishedOnly: true, category: "Loungewear" });

  const heroConfig = {
    title: "Loungewear",
    subtitle: "Unwind in ultra-soft comfort. Designed for every relaxed moment of your day.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
    badges: [
      { iconName: "Cloud", label: "Ultra Soft", sublabel: "Feels Like Nothing" },
      { iconName: "Wind", label: "Breathable", sublabel: "All Day Comfort" },
      { iconName: "Maximize", label: "Relaxed Fit", sublabel: "Move Freely" },
      { iconName: "Sun", label: "All Day Comfort", sublabel: "Morning to Night" }
    ]
  };

  // 1. Circle subcategories for loungewear collection
  const customSubcategories = [
    { name: "Co-ord Sets", slug: "coord-sets", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80" },
    { name: "Pants", slug: "pants", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80" },
    { name: "Tops", slug: "tops", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80" },
    { name: "Shorts", slug: "shorts", image: "https://images.unsplash.com/photo-1506634572416-48cdfe530110?w=100&q=80" },
    { name: "Nightwear", slug: "nightwear", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&q=80" },
    { name: "Robes", slug: "robes", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&q=80" },
    { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80" }
  ];

  // 2. Loungewear Spec Trust Strip
  const trustStripItems = [
    { iconName: "Cloud", label: "Ultra Soft Fabrics", sublabel: "Crafted for comfort" },
    { iconName: "Wind", label: "Breathable All Day", sublabel: "Stay fresh always" },
    { iconName: "RotateCcw", label: "Easy Returns", sublabel: "7-day hassle-free" },
    { iconName: "Leaf", label: "Sustainably Made", sublabel: "Better for the planet" }
  ];

  // 3. Editorial banner at bottom of page
  const bottomContent = (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#EAEAEA]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left card */}
        <div className="bg-[#F5F0EA] rounded-2xl p-8 min-h-[220px] flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-[#2E6F68] tracking-[3px] uppercase font-bold">New Arrivals</span>
            <h3 className="font-display text-[28px] font-bold text-[#2B2B2B] mt-2">
              Fresh Comfort Styles
            </h3>
            <p className="text-[14px] text-[#6E6E6E] mt-1 max-w-[320px]">
              Discover our newest lounge pieces, designed for pure relaxation.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/new-in"
              className="inline-block px-5 py-2.5 bg-[#2B2B2B] text-white hover:bg-[#2E6F68] text-[13px] font-bold rounded-lg transition-colors"
            >
              SHOP NEW IN →
            </Link>
          </div>
        </div>

        {/* Right card */}
        <div className="bg-[#2E6F68] text-white rounded-2xl p-8 min-h-[220px] flex flex-col justify-between">
          <div>
            <span className="text-[11px] text-white/70 tracking-[3px] uppercase font-bold">Maternity</span>
            <h3 className="font-display text-[28px] font-bold text-white mt-2">
              Comfort for Every Stage
            </h3>
            <p className="text-[14px] text-white/80 mt-1 max-w-[320px]">
              Thoughtfully designed loungewear for you and your baby.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/maternity"
              className="inline-block px-5 py-2.5 bg-white text-[#2E6F68] hover:bg-[#FAFAF7] text-[13px] font-bold rounded-lg transition-colors"
            >
              EXPLORE MATERNITY →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );

  return (
    <CategoryPageClient
      initialProducts={products}
      heroConfig={heroConfig}
      type="loungewear"
      customSubcategories={customSubcategories}
      trustStripItems={trustStripItems}
      bottomContent={bottomContent}
    />
  );
}
