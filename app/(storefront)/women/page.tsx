import { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import CategoryPageClient from "@/components/category/CategoryPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Women's Collection | The Comfortables Co.",
  description: "Browse premium Cotton × Bamboo blend dresses, maternity wraps, lounge sets, and accessories for women."
};

export default async function WomenPage() {
  const products = await getProducts({ publishedOnly: true, category: "Women" });

  const heroConfig = {
    title: "Women",
    subtitle: "Made for body. Designed for flow. Discover comfortable basics, dresses, and slow loungewear.",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=80",
    badges: [
      { iconName: "Sparkles", label: "Fluid Drape", sublabel: "Move Effortlessly" },
      { iconName: "Leaf", label: "Eco-Harvested", sublabel: "Sensitive Skin Safe" },
      { iconName: "Heart", label: "Zero Synthetic", sublabel: "Pure Comfort Feel" },
      { iconName: "Shield", label: "Durable Seams", sublabel: "Wear Over & Over" }
    ]
  };

  return <CategoryPageClient initialProducts={products} heroConfig={heroConfig} type="women" />;
}
