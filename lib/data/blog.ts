import { BlogPost } from "../types";
import { createAdminClient } from "../supabase/admin";

function mapBlogPost(row: any): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    content: row.content || "",
    image: row.cover_image || "",
    published: row.is_published,
    date: row.published_at ? row.published_at.substring(0, 10) : ""
  };
}

function mapBlogPostToDb(b: Partial<BlogPost>): any {
  const dbRow: any = {};
  if (b.title !== undefined) dbRow.title = b.title;
  if (b.slug !== undefined) dbRow.slug = b.slug;
  if (b.excerpt !== undefined) dbRow.excerpt = b.excerpt;
  if (b.content !== undefined) dbRow.content = b.content;
  if (b.image !== undefined) dbRow.cover_image = b.image;
  if (b.published !== undefined) dbRow.is_published = b.published;
  if (b.date !== undefined) dbRow.published_at = b.date ? new Date(b.date).toISOString() : null;
  return dbRow;
}

export async function getBlogPosts(options?: { publishedOnly?: boolean }): Promise<BlogPost[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("blog_posts").select("*");
    if (options?.publishedOnly) {
      query = query.eq("is_published", true);
    }
    const { data, error } = await query.order("published_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapBlogPost);
  } catch (error) {
    console.error("Error in getBlogPosts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapBlogPost(data) : null;
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error);
    return null;
  }
}

export async function createBlogPost(data: BlogPost): Promise<BlogPost> {
  const supabase = createAdminClient();
  const dbRow = mapBlogPostToDb(data);
  const { data: inserted, error } = await supabase
    .from("blog_posts")
    .insert(dbRow)
    .select()
    .single();
  if (error) throw error;
  return mapBlogPost(inserted);
}

export async function updateBlogPost(slug: string, data: Partial<BlogPost>): Promise<BlogPost> {
  const supabase = createAdminClient();
  const dbRow = mapBlogPostToDb(data);
  const { data: updated, error } = await supabase
    .from("blog_posts")
    .update(dbRow)
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw error;
  return mapBlogPost(updated);
}

export async function deleteBlogPost(slug: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("slug", slug);
  if (error) throw error;
}
