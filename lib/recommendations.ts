import { products, type Product } from "@/lib/data";

const COMPLEMENTARY_CATEGORIES: Record<string, string[]> = {
  "Everyday Wear": ["Lounge Wear", "Baby Collection"],
  "Lounge Wear": ["Everyday Wear", "Maternity Collection"],
  "Maternity Collection": ["Lounge Wear", "Baby Collection"],
  "Baby Collection": ["Everyday Wear", "Maternity Collection"],
  "Future Wellness Collection": ["Everyday Wear", "Lounge Wear"]
};

export interface RecommendationResult {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

function toRecommendation(product: Product): RecommendationResult {
  return {
    id: product.slug,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category
  };
}

export function getRecommendations(productId: string, limit = 4): RecommendationResult[] {
  const source = products.find((product) => product.slug === productId);
  if (!source) return [];

  const complementary = COMPLEMENTARY_CATEGORIES[source.category] ?? [];
  const sameCategory = products.filter(
    (product) => product.slug !== productId && product.category === source.category
  );
  const complementaryProducts = products.filter(
    (product) => product.slug !== productId && complementary.includes(product.category)
  );

  const ranked = [...sameCategory, ...complementaryProducts];
  const unique = ranked.filter(
    (product, index, list) => list.findIndex((item) => item.slug === product.slug) === index
  );

  if (unique.length < limit) {
    const fillers = products.filter(
      (product) =>
        product.slug !== productId && !unique.some((item) => item.slug === product.slug)
    );
    unique.push(...fillers);
  }

  return unique.slice(0, limit).map(toRecommendation);
}
