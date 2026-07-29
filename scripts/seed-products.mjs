// scripts/seed-products.mjs
// Run with: node scripts/seed-products.mjs
// Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
const envContent = readFileSync(envPath, "utf-8");
envContent.split("\n").forEach((line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim();
    process.env[key] = value;
  }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Helper to build size variants with stock
const sizeStock = (sizes, qty) =>
  Object.fromEntries(sizes.map((s) => [s, qty]));

const STD_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["0-3M", "3-6M", "6-12M", "1-2Y", "2-3Y", "3-4Y"];
const MAT_SIZES  = ["XS", "S", "M", "L", "XL"];

const IMAGES = {
  // Curated Unsplash URLs — minimal, lifestyle, premium apparel aesthetic
  cream_knit:   "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
  white_linen:  "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80",
  beige_jogger: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
  grey_tee:     "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
  navy_henley:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  black_shorts: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=800&q=80",
  floral_dress: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
  white_blouse: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
  wrap_top:     "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
  mat_dress:    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  mat_legging:  "https://images.unsplash.com/photo-1565389600895-9c8d35c2c98c?w=800&q=80",
  mat_top:      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
  baby_onesie:  "https://images.unsplash.com/photo-1590099033615-be195f8d575c?w=800&q=80",
  baby_romper:  "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80",
  baby_set:     "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
  lounge_set:   "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  lounge_pant:  "https://images.unsplash.com/photo-1627225793904-b0543a61f43a?w=800&q=80",
  robe:         "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
};

// ─── SEED DATA ─────────────────────────────────────────────────────────────
const products = [

  // ── NEW IN ──────────────────────────────────────────────────────────────
  {
    name: "AirKnit Everyday Crewneck",
    slug: "airknit-everyday-crewneck",
    category: "New In",
    description: "Our newest arrival — a weightless bamboo-cotton crewneck knit that moves with you. Zero static, all-day breathability, and a relaxed silhouette that layers effortlessly.",
    price: 2490,
    badge: "NEW",
    images: [IMAGES.cream_knit, IMAGES.grey_tee],
    is_published: true,
    variants: sizeStock(STD_SIZES, 20),
    inventory_count: 20 * STD_SIZES.length,
    color_variants: [
      { name: "Oat Cream", hex: "#F5F0E8" },
      { name: "Sage Mist", hex: "#B5C4B1" },
      { name: "Ink Charcoal", hex: "#3A3A3A" },
    ],
    fabric_composition: "60% Bamboo, 40% Organic Cotton",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },
  {
    name: "Cloud Weave Linen Shirt",
    slug: "cloud-weave-linen-shirt",
    category: "New In",
    description: "An open-weave linen shirt reimagined for the tropics. Lightweight and ultra-breathable, it's styled relaxed but finishes clean — perfect from morning coffee to evening plans.",
    price: 1990,
    badge: "NEW",
    images: [IMAGES.white_linen],
    is_published: true,
    variants: sizeStock(STD_SIZES, 18),
    inventory_count: 18 * STD_SIZES.length,
    color_variants: [
      { name: "Pure White", hex: "#FAFAFA" },
      { name: "Clay Beige", hex: "#D9C5B2" },
    ],
    fabric_composition: "100% French Linen",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 4,
    rating: 4.7,
    review_count: 0,
  },
  {
    name: "Bamboo Everyday Jogger",
    slug: "bamboo-everyday-jogger",
    category: "New In",
    description: "The jogger that replaced sweatpants for good. Crafted from our signature bamboo-cotton blend, with a tapered fit, deep pockets, and an adjustable drawstring.",
    price: 2190,
    badge: "BESTSELLER",
    images: [IMAGES.beige_jogger],
    is_published: true,
    variants: sizeStock(STD_SIZES, 25),
    inventory_count: 25 * STD_SIZES.length,
    color_variants: [
      { name: "Warm Sand", hex: "#D4C4A8" },
      { name: "Smoke Grey", hex: "#8E8E8E" },
      { name: "Deep Navy", hex: "#1E2A4A" },
    ],
    fabric_composition: "70% Bamboo, 30% Organic Cotton",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },

  // ── MEN ─────────────────────────────────────────────────────────────────
  {
    name: "Essential Cotton Tee",
    slug: "essential-cotton-tee",
    category: "Men",
    description: "The only T-shirt you'll ever need. Single-jersey, 190 GSM organic cotton. Pre-washed for a soft, settled feel from day one — with a clean structured collar that holds its shape.",
    price: 1290,
    badge: "BESTSELLER",
    images: [IMAGES.grey_tee],
    is_published: true,
    variants: sizeStock(STD_SIZES, 30),
    inventory_count: 30 * STD_SIZES.length,
    color_variants: [
      { name: "Stone Grey", hex: "#9E9E9E" },
      { name: "Pure White", hex: "#FAFAFA" },
      { name: "Midnight Black", hex: "#1A1A1A" },
      { name: "Warm Beige", hex: "#D4C4A8" },
    ],
    fabric_composition: "100% Organic Cotton, 190 GSM",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },
  {
    name: "Bamboo Henley Longline",
    slug: "bamboo-henley-longline",
    category: "Men",
    description: "A relaxed longline henley in our softest bamboo-modal blend. The three-button placket adds a subtle detail while the fabric drapes beautifully and stays odour-free all day.",
    price: 1790,
    badge: "ECO PICK",
    images: [IMAGES.navy_henley],
    is_published: true,
    variants: sizeStock(STD_SIZES, 22),
    inventory_count: 22 * STD_SIZES.length,
    color_variants: [
      { name: "Ocean Navy", hex: "#1E3A5F" },
      { name: "Forest Sage", hex: "#4A6741" },
      { name: "Oatmeal", hex: "#EDE0C8" },
    ],
    fabric_composition: "65% Bamboo, 35% Modal",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },
  {
    name: "CloudSoft Active Shorts",
    slug: "cloudsoft-active-shorts",
    category: "Men",
    description: "Ultra-light active shorts with a built-in liner and 7-inch inseam. The bamboo-blend outer shell is sweat-wicking, anti-chafe, and quick-dry — built for movement, styled for everywhere.",
    price: 1490,
    badge: null,
    images: [IMAGES.black_shorts],
    is_published: true,
    variants: sizeStock(["S", "M", "L", "XL", "XXL"], 28),
    inventory_count: 28 * 5,
    color_variants: [
      { name: "Carbon Black", hex: "#1A1A1A" },
      { name: "Storm Blue", hex: "#3A5070" },
    ],
    fabric_composition: "55% Bamboo, 45% Recycled Polyester",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 4,
    rating: 4.7,
    review_count: 0,
  },

  // ── WOMEN ───────────────────────────────────────────────────────────────
  {
    name: "Floret Wrap Midi Dress",
    slug: "floret-wrap-midi-dress",
    category: "Women",
    description: "An effortless wrap midi dress in soft bamboo-viscose. The adjustable tie waist flatters every figure, the midi length balances style with comfort, and the fabric stays crease-free all day.",
    price: 2990,
    badge: "BESTSELLER",
    images: [IMAGES.floral_dress],
    is_published: true,
    variants: sizeStock(["XS", "S", "M", "L", "XL"], 20),
    inventory_count: 20 * 5,
    color_variants: [
      { name: "Botanical Green", hex: "#6B8F6B" },
      { name: "Dusty Mauve", hex: "#C4A4A4" },
      { name: "Ivory Cream", hex: "#F5EDD9" },
    ],
    fabric_composition: "100% Bamboo Viscose",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },
  {
    name: "Elevated Cotton Blouse",
    slug: "elevated-cotton-blouse",
    category: "Women",
    description: "A breezy everyday blouse in 100% organic cotton. Relaxed through the body with a slightly cinched cuff, it tucks in or out and transitions from desk to dinner with ease.",
    price: 1890,
    badge: "ECO PICK",
    images: [IMAGES.white_blouse],
    is_published: true,
    variants: sizeStock(["XS", "S", "M", "L", "XL"], 25),
    inventory_count: 25 * 5,
    color_variants: [
      { name: "Soft White", hex: "#FAFAFA" },
      { name: "Blush Pink", hex: "#F2C4C4" },
      { name: "Sky Blue", hex: "#A8C4D4" },
    ],
    fabric_composition: "100% Organic Cotton, 140 GSM",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },
  {
    name: "Bamboo Wrap Lounge Top",
    slug: "bamboo-wrap-lounge-top",
    category: "Women",
    description: "Half-structured, half-relaxed — this wrap lounge top in bamboo-modal is the piece that bridges your work-from-home wardrobe and your weekend look. Flattering, functional, endlessly comfortable.",
    price: 1690,
    badge: "NEW",
    images: [IMAGES.wrap_top],
    is_published: true,
    variants: sizeStock(["XS", "S", "M", "L", "XL"], 22),
    inventory_count: 22 * 5,
    color_variants: [
      { name: "Warm Terracotta", hex: "#C4845A" },
      { name: "Sage Green", hex: "#B5C4B1" },
      { name: "Ink Black", hex: "#1A1A1A" },
    ],
    fabric_composition: "60% Bamboo, 40% Modal",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.7,
    review_count: 0,
  },

  // ── MATERNITY ───────────────────────────────────────────────────────────
  {
    name: "Maternity Ribbed Slip Dress",
    slug: "maternity-ribbed-slip-dress",
    category: "Maternity",
    description: "Designed with a stretchy bamboo-cotton rib that grows with your bump. Adjustable straps, ruched side panels, and a smooth under-bump band make this the only dress you'll need through all three trimesters.",
    price: 2790,
    badge: "BESTSELLER",
    images: [IMAGES.mat_dress],
    is_published: true,
    variants: sizeStock(MAT_SIZES, 20),
    inventory_count: 20 * MAT_SIZES.length,
    color_variants: [
      { name: "Ivory", hex: "#F5EDD9" },
      { name: "Dusty Lavender", hex: "#C4BAD4" },
      { name: "Warm Blush", hex: "#F2C4C4" },
    ],
    fabric_composition: "65% Bamboo, 35% Organic Cotton",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },
  {
    name: "Under-Bump Maternity Legging",
    slug: "under-bump-maternity-legging",
    category: "Maternity",
    description: "A four-way stretch bamboo legging with a comfortable under-bump waistband. Opaque, non-pilling, and gentle on sensitive skin — ideal from the first trimester through postpartum.",
    price: 1990,
    badge: "ECO PICK",
    images: [IMAGES.mat_legging],
    is_published: true,
    variants: sizeStock(MAT_SIZES, 25),
    inventory_count: 25 * MAT_SIZES.length,
    color_variants: [
      { name: "Midnight Black", hex: "#1A1A1A" },
      { name: "Charcoal Grey", hex: "#4A4A4A" },
      { name: "Deep Navy", hex: "#1E2A4A" },
    ],
    fabric_composition: "72% Bamboo, 28% Spandex",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },
  {
    name: "Nursing-Friendly Wrap Top",
    slug: "nursing-wrap-top",
    category: "Maternity",
    description: "A bamboo modal nursing wrap top that takes you from bump to breastfeeding seamlessly. The discreet crossover panel offers easy access while the fabric's drape hides the mechanism entirely.",
    price: 2290,
    badge: "NEW",
    images: [IMAGES.mat_top],
    is_published: true,
    variants: sizeStock(MAT_SIZES, 18),
    inventory_count: 18 * MAT_SIZES.length,
    color_variants: [
      { name: "Warm Sand", hex: "#D4C4A8" },
      { name: "Sage Mist", hex: "#B5C4B1" },
      { name: "Soft White", hex: "#FAFAFA" },
    ],
    fabric_composition: "60% Bamboo, 40% Modal",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },

  // ── BABY & KIDS ─────────────────────────────────────────────────────────
  {
    name: "Organic Cotton Baby Onesie",
    slug: "organic-cotton-baby-onesie",
    category: "Baby & Kids",
    description: "GOTS-certified organic cotton onesie with nickel-free snaps, a wide envelope neck, and flat seams throughout. Sized generously so it lasts longer, and pre-washed for immediate softness.",
    price: 890,
    badge: "ECO PICK",
    images: [IMAGES.baby_onesie],
    is_published: true,
    variants: sizeStock(KIDS_SIZES, 30),
    inventory_count: 30 * KIDS_SIZES.length,
    color_variants: [
      { name: "Soft White", hex: "#FAFAFA" },
      { name: "Warm Oat", hex: "#EDE0C8" },
      { name: "Sky Blue", hex: "#A8C4D4" },
      { name: "Petal Pink", hex: "#F2C4C4" },
    ],
    fabric_composition: "100% GOTS Organic Cotton, 180 GSM",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },
  {
    name: "Bamboo Baby Romper",
    slug: "bamboo-baby-romper",
    category: "Baby & Kids",
    description: "A thermoregulating bamboo romper that's cooler than cotton in summer and warmer in winter. UV50+ protection built in. Snaps along the full inner leg for effortless diaper changes.",
    price: 1190,
    badge: "BESTSELLER",
    images: [IMAGES.baby_romper],
    is_published: true,
    variants: sizeStock(KIDS_SIZES, 25),
    inventory_count: 25 * KIDS_SIZES.length,
    color_variants: [
      { name: "Sage Green", hex: "#B5C4B1" },
      { name: "Warm Sand", hex: "#D4C4A8" },
      { name: "Lavender Mist", hex: "#C4BAD4" },
    ],
    fabric_composition: "95% Bamboo, 5% Elastane",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },
  {
    name: "Kids Cotton Lounge Set",
    slug: "kids-cotton-lounge-set",
    category: "Baby & Kids",
    description: "A matching top-and-bottom set in 100% organic cotton jersey. Elastic waistband, ribbed cuffs, and a printed chest graphic — made to survive both playground adventures and nap time.",
    price: 1690,
    badge: "NEW",
    images: [IMAGES.baby_set],
    is_published: true,
    variants: sizeStock(["1-2Y", "2-3Y", "3-4Y", "4-5Y", "5-6Y"], 20),
    inventory_count: 20 * 5,
    color_variants: [
      { name: "Warm Oat", hex: "#EDE0C8" },
      { name: "Sky Blue", hex: "#A8C4D4" },
      { name: "Warm Terracotta", hex: "#C4845A" },
    ],
    fabric_composition: "100% Organic Cotton Jersey",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },

  // ── LOUNGEWEAR ──────────────────────────────────────────────────────────
  {
    name: "CloudSoft Lounge Joggers",
    slug: "cloudsoft-lounge-joggers",
    category: "Loungewear",
    description: "The jogger that replaced every other pair in your wardrobe. 280 GSM bamboo-cotton fleece with a brushed interior, adjustable waistband, and deep side pockets. Impossibly soft from the first wear.",
    price: 2490,
    badge: "BESTSELLER",
    images: [IMAGES.lounge_pant],
    is_published: true,
    variants: sizeStock(STD_SIZES, 25),
    inventory_count: 25 * STD_SIZES.length,
    color_variants: [
      { name: "Oat Cream", hex: "#F5F0E8" },
      { name: "Stone Grey", hex: "#9E9E9E" },
      { name: "Midnight Black", hex: "#1A1A1A" },
      { name: "Warm Sand", hex: "#D4C4A8" },
    ],
    fabric_composition: "65% Bamboo, 35% Organic Cotton, 280 GSM Fleece",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.9,
    review_count: 0,
  },
  {
    name: "Bamboo Lounge Co-ord Set",
    slug: "bamboo-lounge-coord-set",
    category: "Loungewear",
    description: "A complete matching lounge set in our signature bamboo-modal blend — short-sleeve top and full-length pants. Pre-matched, already perfect. From your morning routine to your evening unwind.",
    price: 3490,
    badge: "NEW",
    images: [IMAGES.lounge_set],
    is_published: true,
    variants: sizeStock(STD_SIZES, 18),
    inventory_count: 18 * STD_SIZES.length,
    color_variants: [
      { name: "Warm Blush", hex: "#F2C4C4" },
      { name: "Sage Green", hex: "#B5C4B1" },
      { name: "Ink Charcoal", hex: "#3A3A3A" },
    ],
    fabric_composition: "60% Bamboo, 40% Modal",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },
  {
    name: "Organic Cotton Waffle Robe",
    slug: "organic-cotton-waffle-robe",
    category: "Loungewear",
    description: "A lightweight waffle-knit robe in 100% organic cotton. Pocketed, belted, and generously cut — it's the wrap-around comfort you reach for after every shower, every time.",
    price: 2990,
    badge: "ECO PICK",
    images: [IMAGES.robe],
    is_published: true,
    variants: sizeStock(["S/M", "L/XL", "XXL"], 20),
    inventory_count: 20 * 3,
    color_variants: [
      { name: "Ivory White", hex: "#F5EDD9" },
      { name: "Soft Clay", hex: "#D4C4A8" },
    ],
    fabric_composition: "100% GOTS Organic Cotton Waffle Knit",
    comfort_score: 5,
    breathability_score: 5,
    softness_score: 5,
    rating: 4.8,
    review_count: 0,
  },
];

// ─── INSERT ─────────────────────────────────────────────────────────────────
async function seed() {
  console.log(`\n🌱 Seeding ${products.length} products into Supabase...\n`);
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    // Check if slug already exists
    const { data: existing } = await supabase
      .from("products")
      .select("slug")
      .eq("slug", product.slug)
      .maybeSingle();

    if (existing) {
      console.log(`  ⏭  Skipping "${product.name}" — slug already exists`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("products").insert(product);

    if (error) {
      console.error(`  ❌ Failed "${product.name}":`, error.message);
      failed++;
    } else {
      console.log(`  ✅ Inserted [${product.category}] ${product.name}`);
      inserted++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`  ✅ Inserted : ${inserted}`);
  console.log(`  ⏭  Skipped  : ${skipped}`);
  console.log(`  ❌ Failed   : ${failed}`);
  console.log(`─────────────────────────────────────────\n`);
}

seed().catch((e) => {
  console.error("Seed script failed:", e);
  process.exit(1);
});
