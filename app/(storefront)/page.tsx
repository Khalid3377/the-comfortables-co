import type { Metadata } from "next";
import { getProducts } from "@/lib/data/products";
import { getBlogPosts } from "@/lib/data/blog";
import { getCategories } from "@/lib/data/categories";
import { getSettings } from "@/lib/data/settings";
import { HomeClient } from "@/components/home/HomeClient";
import { createClient as createServerComponentClient } from "@/lib/supabase/server";

// Force dynamic so that edits in the admin panel reflect on home refresh
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Comfortables Co. | Premium Bamboo Wear",
  description: "Premium Cotton x Bamboo apparel designed for breathable comfort, skin wellness, and sustainable modern living."
};

export default async function HomePage() {
  const products = await getProducts({ publishedOnly: true });
  const articles = await getBlogPosts({ publishedOnly: true });
  const categoriesList = await getCategories();
  const settings = await getSettings();
  const supabase = await createServerComponentClient();
  const { data: heroContent, error: heroError } = await supabase.from("store_content").select("payload").eq("slug", "homepage-hero").maybeSingle();
  if (heroError) console.error("HOMEPAGE_HERO_CONTENT_ERROR", heroError);
  const payload = heroContent?.payload && typeof heroContent.payload === "object" && !Array.isArray(heroContent.payload) ? heroContent.payload as Record<string, unknown> : {};
  const hero = {
    heading: typeof payload.heading === "string" ? payload.heading : "The Most Comfortable Clothing",
    subheading: typeof payload.subheading === "string" ? payload.subheading : "Premium everyday essentials",
    ctaText: typeof payload.cta_text === "string" ? payload.cta_text : "Shop Now",
  };

  return (
    <HomeClient
      products={products}
      articles={articles}
      categories={categoriesList}
      settings={settings}
      hero={hero}
    />
  );
}
