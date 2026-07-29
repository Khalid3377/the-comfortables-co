import { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import CategoryPageClient from "@/components/category/CategoryPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0; // forces dynamic rendering on every request

export const metadata: Metadata = {
  title: "New In | The Comfortables Co.",
  description: "Discover fresh arrivals in Cotton × Bamboo blend loungewear, everyday pieces, and accessories."
};

export default async function NewInPage() {
  const products = await getProducts({ publishedOnly: true, category: "New In" });

  const heroConfig = {
    title: "New In",
    subtitle: "Fresh styles. Timeless comfort. Discover our latest arrivals, made for you.",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1200&q=80",
    badges: [
      { iconName: "Package", label: "Just Landed", sublabel: "Fresh Styles" },
      { iconName: "Star", label: "Premium Comfort", sublabel: "Everyday Ease" },
      { iconName: "Leaf", label: "Thoughtfully Made", sublabel: "For You & Earth" },
      { iconName: "Clock", label: "Limited Pieces", sublabel: "Shop Before It's Gone" }
    ]
  };

  return <CategoryPageClient initialProducts={products} heroConfig={heroConfig} type="new-in" />;
}
