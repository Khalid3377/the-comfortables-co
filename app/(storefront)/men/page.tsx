import { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import CategoryPageClient from "@/components/category/CategoryPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Men's Collection | The Comfortables Co.",
  description: "Browse premium Cotton × Bamboo blend everyday wear, tees, loungewear, and activewear for men."
};

export default async function MenPage() {
  const products = await getProducts({ publishedOnly: true, category: "Men" });

  const heroConfig = {
    title: "Men",
    subtitle: "Everyday comfort. Effortless style. Thoughtfully crafted for every you.",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80",
    badges: [
      { iconName: "Wind", label: "Breathable", sublabel: "All Day Comfort" },
      { iconName: "Leaf", label: "Soft on Skin", sublabel: "Gentle & Safe" },
      { iconName: "Globe", label: "Sustainable", sublabel: "Better for Earth" },
      { iconName: "Shield", label: "Durable Quality", sublabel: "Made to Last" }
    ]
  };

  return <CategoryPageClient initialProducts={products} heroConfig={heroConfig} type="men" />;
}
