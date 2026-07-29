import { Product } from "../types";
import { createAdminClient } from "../supabase/admin";

function mapProduct(row: any): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category || "",
    collection: row.collection || "Core Comfort",
    price: Number(row.price),
    colors: row.color_variants ? row.color_variants.map((c: any) => c.name) : [],
    sizes: row.variants && Object.keys(row.variants).length > 0 ? Object.keys(row.variants) : ["XS", "S", "M", "L", "XL"],
    material: row.fabric_composition || "",
    image: row.images && row.images.length > 0 ? row.images[0] : "",
    gallery: row.images || [],
    description: row.description || "",
    inventory: row.inventory_count || 0,
    stockBySize: row.variants || {},
    scores: {
      comfort: row.comfort_score || 0,
      breathability: row.breathability_score || 0,
      softness: row.softness_score || 0
    },
    reviews: [],
    published: row.is_published,
    badge: row.badge || null,
    rating: row.rating ? Number(row.rating) : 0,
    reviewCount: row.review_count || 0,
    colorVariants: row.color_variants || []
  };
}

function mapProductToDb(p: Partial<Product>): any {
  const dbRow: any = {};
  if (p.name !== undefined) dbRow.name = p.name;
  if (p.slug !== undefined) dbRow.slug = p.slug;
  if (p.description !== undefined) dbRow.description = p.description;
  if (p.price !== undefined) dbRow.price = p.price;
  if (p.category !== undefined) dbRow.category = p.category;
  if (p.gallery !== undefined) dbRow.images = p.gallery;
  else if (p.image !== undefined) dbRow.images = [p.image];
  if (p.badge !== undefined) dbRow.badge = p.badge;
  if (p.colorVariants !== undefined) dbRow.color_variants = p.colorVariants;
  if (p.stockBySize !== undefined) {
    dbRow.variants = p.stockBySize;
    dbRow.inventory_count = Object.values(p.stockBySize).reduce((sum: number, val) => sum + Number(val), 0);
  }
  if (p.scores !== undefined) {
    dbRow.comfort_score = p.scores.comfort;
    dbRow.breathability_score = p.scores.breathability;
    dbRow.softness_score = p.scores.softness;
  }
  if (p.material !== undefined) dbRow.fabric_composition = p.material;
  if (p.published !== undefined) dbRow.is_published = p.published;
  if (p.rating !== undefined) dbRow.rating = p.rating;
  if (p.reviewCount !== undefined) dbRow.review_count = p.reviewCount;
  return dbRow;
}

export async function getProducts(options?: { publishedOnly?: boolean; category?: string }): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("products").select("*");
    if (options?.publishedOnly) {
      query = query.eq("is_published", true);
    }
    if (options?.category) {
      query = query.eq("category", options.category);
    }
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapProduct);
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProduct(data) : null;
  } catch (error) {
    console.error("Error in getProductBySlug:", error);
    return null;
  }
}

export async function createProduct(data: Product): Promise<Product> {
  const supabase = createAdminClient();
  const dbRow = mapProductToDb(data);
  const { data: inserted, error } = await supabase
    .from("products")
    .insert(dbRow)
    .select()
    .single();
  if (error) throw error;
  return mapProduct(inserted);
}

export async function updateProduct(slug: string, data: Partial<Product>): Promise<Product> {
  const supabase = createAdminClient();
  const dbRow = mapProductToDb(data);
  const { data: updated, error } = await supabase
    .from("products")
    .update(dbRow)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return mapProduct(updated);
}

export async function deleteProduct(slug: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("slug", slug);
  if (error) throw error;
}
