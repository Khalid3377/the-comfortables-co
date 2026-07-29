import type { MetadataRoute } from "next";
import { articles, products } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://thecomfortable.co";
  const routes = ["", "/shop", "/fabric-innovation", "/sustainability", "/about", "/journal", "/contact"];
  return [
    ...routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${base}/product/${product.slug}`, lastModified: new Date() })),
    ...articles.map((article) => ({ url: `${base}/journal/${article.slug}`, lastModified: new Date() }))
  ];
}
