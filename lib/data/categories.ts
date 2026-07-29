import { Category } from "../types";
import { createAdminClient } from "../supabase/admin";

function mapCategory(row: any): Category {
  return {
    slug: row.slug,
    name: row.name,
    image: row.image_url || "",
    description: row.description || ""
  };
}

function mapCategoryToDb(c: Partial<Category>): any {
  const dbRow: any = {};
  if (c.name !== undefined) dbRow.name = c.name;
  if (c.slug !== undefined) dbRow.slug = c.slug;
  if (c.image !== undefined) dbRow.image_url = c.image;
  if (c.description !== undefined) dbRow.description = c.description;
  return dbRow;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data || []).map(mapCategory);
  } catch (error) {
    console.error("Error in getCategories:", error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCategory(data) : null;
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error);
    return null;
  }
}

export async function createCategory(data: Category): Promise<Category> {
  const supabase = createAdminClient();
  const dbRow = mapCategoryToDb(data);
  const { data: inserted, error } = await supabase
    .from("categories")
    .insert(dbRow)
    .select()
    .single();
  if (error) throw error;
  return mapCategory(inserted);
}

export async function updateCategory(slug: string, data: Partial<Category>): Promise<Category> {
  const supabase = createAdminClient();
  const dbRow = mapCategoryToDb(data);
  const { data: updated, error } = await supabase
    .from("categories")
    .update(dbRow)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return mapCategory(updated);
}

export async function deleteCategory(slug: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("slug", slug);
  if (error) throw error;
}
