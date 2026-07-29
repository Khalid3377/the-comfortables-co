import { Product, Category, BlogPost, Review, DiscountCode, Customer, Order, SiteSetting } from "../types";

export let products: Product[] = [
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
    ],
    published: true
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
    reviews: [{ name: "Meera", rating: 5, text: "It feels calm on the body. Exactly what maternity loungewear should feel like." }],
    published: true
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
    reviews: [{ name: "Nisha", rating: 5, text: "Supportive without pressure, and beautiful enough for dinner." }],
    published: true
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
    reviews: [{ name: "Aditi", rating: 5, text: "No irritation, no overheating, just a very happy baby." }],
    published: true
  }
];

export let categories: Category[] = [
  {
    slug: "everyday-wear",
    name: "Everyday Wear",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=80",
    description: "Premium tees and structural basics designed for daily movement and breathable wear."
  },
  {
    slug: "lounge-wear",
    name: "Lounge Wear",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    description: "Fluid, relaxed-fit layers created for slow weekends and work-from-home comfort."
  },
  {
    slug: "maternity-collection",
    name: "Maternity Collection",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=600&q=80",
    description: "Adaptive, low-friction designs that stretch and support changing bodies gently."
  },
  {
    slug: "baby-collection",
    name: "Baby Collection",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80",
    description: "Hypoallergenic, thermoregulating onesies and coordinates for delicate skin."
  },
  {
    slug: "future-wellness-collection",
    name: "Future Wellness Collection",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
    description: "Active recovery and rest wear utilizing advanced organic bamboo fiber structures."
  }
];

export let blogPosts: BlogPost[] = [
  {
    slug: "benefits-of-bamboo-fabric",
    title: "Benefits of Bamboo Fabric",
    excerpt: "Why bamboo blends feel cool, soft, and naturally suited for long wear.",
    content: `Bamboo fabric is quickly becoming the material of choice for premium comfort apparel. But what exactly makes it so special?

### 1. Thermoregulating & Breathable
Bamboo fibers have natural micro-gaps that allow air to flow freely. This means the fabric keeps you cool in warm weather and acts as an insulator during cooler days.

### 2. Exceptional Softness
The fibers are round and smooth, meaning they don't have the micro-spurs that can make other fabrics scratchy. It feels similar to silk or cashmere on the skin.

### 3. Sustainable and Fast-Growing
Bamboo requires zero pesticides, very little water, and regenerates rapidly from its own roots after harvesting.`,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85",
    published: true,
    date: "2026-06-15"
  },
  {
    slug: "comfort-impacts-productivity",
    title: "How Comfort Impacts Productivity",
    excerpt: "The subtle connection between tactile comfort, focus, and daily energy.",
    content: `Does what you wear affect your focus and cognitive capacity? Modern psychology and textile science say yes.

### The Cognitive Load of Friction
Stiff seams, tight waistbands, and non-breathable fabrics create constant micro-distractions. Your body uses subtle energy managing thermal discomfort and skin irritation.

By choosing soft, flexible, and thermoregulating fibers like Cotton-Bamboo blends, you remove these background tactile alerts, leaving more mental bandwidth for your work and creative routines.`,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    published: true,
    date: "2026-06-20"
  },
  {
    slug: "sustainable-fashion-india",
    title: "Sustainable Fashion in India",
    excerpt: "A practical view of responsible materials, better production, and durable basics.",
    content: `India is a global hub for textile manufacturing, and the shift towards sustainability is reshaping the industry.

### Localized Sourcing
By sourcing organic cotton and bamboo within regional clusters, we dramatically reduce carbon footprints associated with material transport.

### Durable Design Philosophy
True sustainability starts with creating garments that last. We construct our tees and lounge sets with double-needle stitching and pre-shrunk fabrics to avoid the throwaway lifecycle.`,
    image: "https://images.unsplash.com/photo-1532467411038-57680e3dc0f1?auto=format&fit=crop&w=1200&q=85",
    published: true,
    date: "2026-06-22"
  },
  {
    slug: "clothing-for-sensitive-skin",
    title: "Choosing Clothing for Sensitive Skin",
    excerpt: "Fabric, seams, moisture, and fit decisions that help skin feel settled.",
    content: `Managing sensory sensitivities or eczema requires a thoughtful look at your daily wardrobe. Here is a brief guide:

- **Fiber Choice**: Avoid 100% synthetics that trap heat and moisture. Choose breathable organic blends.
- **Seams**: Look for flat-lock or low-profile seams to reduce skin friction.
- **pH Balance**: Ensure garments undergo organic washing stages so no harsh alkaline chemicals remain.`,
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=85",
    published: true,
    date: "2026-06-25"
  }
];

export let reviews: Review[] = [
  {
    id: "rev-1",
    productSlug: "cloud-knit-tee",
    productName: "CloudKnit Everyday Tee",
    name: "Anaya",
    rating: 5,
    text: "Soft enough for sensitive skin and structured enough for office days.",
    status: "approved",
    date: "2026-06-24"
  },
  {
    id: "rev-2",
    productSlug: "cloud-knit-tee",
    productName: "CloudKnit Everyday Tee",
    name: "Rohan",
    rating: 5,
    text: "The tee I keep reaching for after every wash.",
    status: "approved",
    date: "2026-06-25"
  },
  {
    id: "rev-3",
    productSlug: "bamboo-lounge-set",
    productName: "BambooFlow Lounge Set",
    name: "Meera",
    rating: 5,
    text: "It feels calm on the body. Exactly what maternity loungewear should feel like.",
    status: "approved",
    date: "2026-06-26"
  },
  {
    id: "rev-4",
    productSlug: "maternity-wrap-dress",
    productName: "Maternity Ease Wrap Dress",
    name: "Nisha",
    rating: 5,
    text: "Supportive without pressure, and beautiful enough for dinner.",
    status: "approved",
    date: "2026-06-27"
  },
  {
    id: "rev-5",
    productSlug: "baby-cloud-onesie",
    productName: "BabyCloud Onesie",
    name: "Aditi",
    rating: 5,
    text: "No irritation, no overheating, just a very happy baby.",
    status: "approved",
    date: "2026-06-28"
  },
  {
    id: "rev-6",
    productSlug: "cloud-knit-tee",
    productName: "CloudKnit Everyday Tee",
    name: "Karan",
    rating: 4,
    text: "Very comfortable but I wish they had a navy blue color option.",
    status: "pending",
    date: "2026-06-29"
  },
  {
    id: "rev-7",
    productSlug: "bamboo-lounge-set",
    productName: "BambooFlow Lounge Set",
    name: "Priya",
    rating: 5,
    text: "Absolutely love it, softest set I own. Worth every rupee!",
    status: "pending",
    date: "2026-06-29"
  }
];

export let discountCodes: DiscountCode[] = [
  { code: "COMFORT10", type: "percentage", value: 10, usageLimit: 100, usageCount: 42, expiryDate: "2026-12-31", active: true },
  { code: "WELCOME15", type: "percentage", value: 15, usageLimit: 200, usageCount: 15, expiryDate: "2026-09-30", active: true },
  { code: "SOFT300", type: "fixed", value: 300, usageLimit: 50, usageCount: 12, expiryDate: "2026-08-15", active: true },
  { code: "BAMBOOFAN", type: "percentage", value: 20, usageLimit: 10, usageCount: 10, expiryDate: "2026-06-01", active: false }
];

export let customers: Customer[] = [
  { id: "cust-1", name: "Aarav Sharma", email: "aarav@gmail.com", phone: "+91 98765 43210", createdAt: "2026-05-01T12:00:00Z", joinedAt: "2026-05-01T12:00:00Z" },
  { id: "cust-2", name: "Isha Patel", email: "isha.p@yahoo.com", phone: "+91 87654 32109", createdAt: "2026-05-10T14:30:00Z", joinedAt: "2026-05-10T14:30:00Z" },
  { id: "cust-3", name: "Vihaan Gupta", email: "vihaan.g@gmail.com", phone: "+91 76543 21098", createdAt: "2026-05-15T09:15:00Z", joinedAt: "2026-05-15T09:15:00Z" },
  { id: "cust-4", name: "Ananya Rao", email: "ananya.r@outlook.com", phone: "+91 95432 10987", createdAt: "2026-06-01T10:45:00Z", joinedAt: "2026-06-01T10:45:00Z" },
  { id: "cust-5", name: "Kabir Singh", email: "kabir.singh@gmail.com", phone: "+91 91234 56789", createdAt: "2026-06-10T16:20:00Z", joinedAt: "2026-06-10T16:20:00Z" }
];

export let orders: Order[] = [
  {
    id: "ORD-9481",
    date: "2026-06-20T10:30:00Z",
    createdAt: "2026-06-20T10:30:00Z",
    customerName: "Aarav Sharma",
    customerEmail: "aarav@gmail.com",
    customerPhone: "+91 98765 43210",
    shippingAddress: "102, Shanti Kunj, Juhu, Mumbai, Maharashtra 400049",
    items: [{ productSlug: "cloud-knit-tee", productName: "CloudKnit Everyday Tee", quantity: 2, price: 1890, size: "M", color: "Eucalyptus" }],
    subtotal: 3780,
    discount: 378,
    total: 3402,
    status: "delivered",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    discountCode: "COMFORT10"
  },
  {
    id: "ORD-9482",
    date: "2026-06-22T15:45:00Z",
    createdAt: "2026-06-22T15:45:00Z",
    customerName: "Isha Patel",
    customerEmail: "isha.p@yahoo.com",
    customerPhone: "+91 87654 32109",
    shippingAddress: "Flat 4B, Eden Gardens, Kolkata, West Bengal 700021",
    items: [{ productSlug: "bamboo-lounge-set", productName: "BambooFlow Lounge Set", quantity: 1, price: 4290, size: "S", color: "Sage" }],
    subtotal: 4290,
    discount: 0,
    total: 4290,
    status: "delivered",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered"
  },
  {
    id: "ORD-9483",
    date: "2026-06-25T11:20:00Z",
    createdAt: "2026-06-25T11:20:00Z",
    customerName: "Vihaan Gupta",
    customerEmail: "vihaan.g@gmail.com",
    customerPhone: "+91 76543 21098",
    shippingAddress: "54, Double Road, Indiranagar, Bengaluru, Karnataka 560038",
    items: [
      { productSlug: "cloud-knit-tee", productName: "CloudKnit Everyday Tee", quantity: 1, price: 1890, size: "L", color: "Charcoal" },
      { productSlug: "baby-cloud-onesie", productName: "BabyCloud Onesie", quantity: 2, price: 1490, size: "3-6M", color: "Mint" }
    ],
    subtotal: 4870,
    discount: 0,
    total: 4870,
    status: "shipped",
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped"
  },
  {
    id: "ORD-9484",
    date: "2026-06-27T09:10:00Z",
    createdAt: "2026-06-27T09:10:00Z",
    customerName: "Ananya Rao",
    customerEmail: "ananya.r@outlook.com",
    customerPhone: "+91 95432 10987",
    shippingAddress: "A-12, Sector 15, Noida, Uttar Pradesh 201301",
    items: [{ productSlug: "maternity-wrap-dress", productName: "Maternity Ease Wrap Dress", quantity: 1, price: 3890, size: "M", color: "Clay" }],
    subtotal: 3890,
    discount: 583.5,
    total: 3306.5,
    status: "processing",
    paymentStatus: "Paid",
    fulfillmentStatus: "Unfulfilled",
    discountCode: "WELCOME15"
  },
  {
    id: "ORD-9485",
    date: "2026-06-28T16:00:00Z",
    createdAt: "2026-06-28T16:00:00Z",
    customerName: "Kabir Singh",
    customerEmail: "kabir.singh@gmail.com",
    customerPhone: "+91 91234 56789",
    shippingAddress: "Plot 89, Gachibowli, Hyderabad, Telangana 500032",
    items: [{ productSlug: "cloud-knit-tee", productName: "CloudKnit Everyday Tee", quantity: 1, price: 1890, size: "XL", color: "Ivory" }],
    subtotal: 1890,
    discount: 0,
    total: 1890,
    status: "pending",
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled"
  },
  {
    id: "ORD-9486",
    date: "2026-06-29T11:45:00Z",
    createdAt: "2026-06-29T11:45:00Z",
    customerName: "Isha Patel",
    customerEmail: "isha.p@yahoo.com",
    customerPhone: "+91 87654 32109",
    shippingAddress: "Flat 4B, Eden Gardens, Kolkata, West Bengal 700021",
    items: [{ productSlug: "baby-cloud-onesie", productName: "BabyCloud Onesie", quantity: 1, price: 1490, size: "0-3M", color: "Milk" }],
    subtotal: 1490,
    discount: 300,
    total: 1190,
    status: "pending",
    paymentStatus: "Pending",
    fulfillmentStatus: "Unfulfilled",
    discountCode: "SOFT300"
  }
];

export let settings: SiteSetting = {
  announcementMessages: [
    "COTTON × BAMBOO — OEKO-TEX CERTIFIED",
    "30-DAY SOFTNESS GUARANTEE",
    "MATERNITY • BABY • EVERYDAY",
    "FREE SHIPPING OVER ₹1,999"
  ],
  announcementSpeed: 28,
  heroTitle: "Comfort that cares.",
  heroSubtitle: "Premium Cotton × Bamboo apparel designed for breathable comfort, skin wellness, and sustainable living — made for maternity, baby and the slow life in between.",
  comfortPromise: [
    { title: "Comfort-first Philosophy", text: "Pieces are shaped around how the body sits, stretches, breathes, and rests." },
    { title: "Skin Wellness", text: "A gentler surface for sensitive skin users, parents, and long work-from-home days." },
    { title: "Sustainable Intent", text: "Better materials, durable construction, and a slower wardrobe mindset." },
    { title: "Tailored Versatility", text: "Designed to seamlessly transition from rest to travel, adapting to your day's flow." }
  ],
  sustainabilityTimeline: [
    {
      step: "Source",
      title: "Eco-Harvesting Stalks & Cotton",
      desc: "We harvest organic bamboo stalks and long-staple cotton from farms in India that prioritize soil health, zero pesticides, and closed-loop water conservation."
    },
    {
      step: "Spin",
      title: "Micro-Air-Channel Spinning",
      desc: "Fibers are combed together and spun into custom yarn structures featuring micro-gaps. This geometry allows the fabric to ventilate heat and repel dampness."
    },
    {
      step: "Knit",
      title: "Circular Tension Knitting",
      desc: "Knitted on specialized circular machines that tension the organic fibers to allow maximum natural stretch and recovery, without adding heavy synthetic elastanes."
    },
    {
      step: "Finish",
      title: "Organic Enzyme Washing",
      desc: "Washed with organic enzymes for skin-safe pH balance. We pre-shrink the material so the fit remains stable and smooth over dozens of wash cycles."
    },
    {
      step: "Wear-test",
      title: "Sensory Comfort Wear-Testing",
      desc: "Every batch is tested by eczema sufferers and sensory-sensitive wearers. We verify low friction levels on seams and test comfort during active, all-day motion."
    }
  ]
};
