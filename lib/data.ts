export type Product = {
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  colors: string[];
  sizes: string[];
  material: string;
  image: string;
  gallery: string[];
  description: string;
  inventory: number;
  stockBySize: Record<string, number>;
  scores: { comfort: number; breathability: number; softness: number };
  reviews: { name: string; text: string; rating: number }[];
  stage?: string;
  ageRange?: string;
};

export const products: Product[] = [
  {
    slug: "cloud-knit-tee",
    name: "CloudKnit Everyday Tee",
    category: "Everyday Wear",
    collection: "Core Comfort",
    price: 1890,
    colors: ["Eucalyptus", "Ivory", "Charcoal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "68% cotton, 27% bamboo viscose, 5% elastane",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "A breathable everyday tee with a cool hand feel, gentle stretch, and a polished drape.",
    inventory: 42,
    stockBySize: { XS: 12, S: 8, M: 3, L: 10, XL: 9 },
    scores: { comfort: 96, breathability: 94, softness: 98 },
    reviews: [
      { name: "Anaya", rating: 5, text: "Soft enough for sensitive skin and structured enough for office days." },
      { name: "Rohan", rating: 5, text: "The tee I keep reaching for after every wash." }
    ]
  },
  {
    slug: "bamboo-lounge-set",
    name: "BambooFlow Lounge Set",
    category: "Lounge Wear",
    collection: "At Home",
    price: 4290,
    colors: ["Sage", "Oat", "Deep Teal"],
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "62% bamboo viscose, 33% cotton, 5% elastane",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1759229874786-6d0cc75d95be?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "A fluid lounge set made for long flights, slow weekends, and work-from-home rituals.",
    inventory: 8,
    stockBySize: { XS: 2, S: 2, M: 2, L: 1, XL: 1 },
    scores: { comfort: 99, breathability: 92, softness: 97 },
    reviews: [{ name: "Meera", rating: 5, text: "It feels calm on the body. Exactly what maternity loungewear should feel like." }]
  },
  {
    slug: "maternity-wrap-dress",
    name: "Maternity Ease Wrap Dress",
    category: "Maternity Collection",
    collection: "Motherhood",
    price: 3890,
    colors: ["Sea Glass", "Black", "Clay"],
    sizes: ["S", "M", "L", "XL"],
    material: "64% cotton, 31% bamboo viscose, 5% elastane",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "A gentle wrap silhouette with adaptive fit and moisture-aware comfort for changing bodies.",
    inventory: 17,
    stockBySize: { S: 5, M: 4, L: 2, XL: 6 },
    scores: { comfort: 98, breathability: 95, softness: 96 },
    reviews: [{ name: "Nisha", rating: 5, text: "Supportive without pressure, and beautiful enough for dinner." }]
  },
  {
    slug: "baby-cloud-onesie",
    name: "BabyCloud Onesie",
    category: "Baby Collection",
    collection: "Newborn",
    price: 1490,
    colors: ["Milk", "Mint", "Moon"],
    sizes: ["0-3M", "3-6M", "6-12M"],
    material: "70% cotton, 30% bamboo viscose",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=1200&q=85"
    ],
    description: "A delicate onesie built with skin-safe softness, breathable seams, and easy-change closures.",
    inventory: 64,
    stockBySize: { "0-3M": 0, "3-6M": 25, "6-12M": 39 },
    scores: { comfort: 99, breathability: 96, softness: 99 },
    reviews: [{ name: "Aditi", rating: 5, text: "No irritation, no overheating, just a very happy baby." }]
  }
];

export const categories = ["Everyday Wear", "Lounge Wear", "Maternity Collection", "Baby Collection", "Future Wellness Collection"];

export const articles = [
  {
    slug: "benefits-of-bamboo-fabric",
    title: "Benefits of Bamboo Fabric",
    excerpt: "Why bamboo blends feel cool, soft, and naturally suited for long wear.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "comfort-impacts-productivity",
    title: "How Comfort Impacts Productivity",
    excerpt: "The subtle connection between tactile comfort, focus, and daily energy.",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "sustainable-fashion-india",
    title: "Sustainable Fashion in India",
    excerpt: "A practical view of responsible materials, better production, and durable basics.",
    image: "https://images.unsplash.com/photo-1532467411038-57680e3dc0f1?auto=format&fit=crop&w=1200&q=85"
  },
  {
    slug: "clothing-for-sensitive-skin",
    title: "Choosing Clothing for Sensitive Skin",
    excerpt: "Fabric, seams, moisture, and fit decisions that help skin feel settled.",
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=85"
  }
];
