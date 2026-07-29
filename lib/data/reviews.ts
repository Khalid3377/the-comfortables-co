import { Review } from "../types";
import { createAdminClient } from "../supabase/admin";

function mapReview(row: any): Review {
  const prod = row.products || {};
  return {
    id: row.id,
    productSlug: prod.slug || "",
    productName: prod.name || "",
    name: row.customer_name || "Customer",
    rating: row.rating,
    text: row.comment || "",
    status: row.is_approved ? "approved" : "pending",
    date: row.created_at ? row.created_at.substring(0, 10) : ""
  };
}

export async function getReviews(options?: { status?: Review["status"] }): Promise<Review[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from("reviews").select("*, products(name, slug)");
    
    if (options?.status) {
      const isApproved = options.status === "approved";
      query = query.eq("is_approved", isApproved);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapReview);
  } catch (error) {
    console.error("Error in getReviews:", error);
    return [];
  }
}

export async function updateReviewStatus(id: string, status: Review["status"]): Promise<Review> {
  const supabase = createAdminClient();
  const isApproved = status === "approved";
  const { data: updated, error } = await supabase
    .from("reviews")
    .update({ is_approved: isApproved })
    .eq("id", id)
    .select("*, products(name, slug)")
    .single();
  if (error) throw error;
  return mapReview(updated);
}

export async function createReview(data: Review): Promise<Review> {
  const supabase = createAdminClient();
  
  // Find product ID by slug
  const { data: prod, error: prodErr } = await supabase
    .from("products")
    .select("id")
    .eq("slug", data.productSlug)
    .maybeSingle();
  if (prodErr) throw prodErr;
  
  const productId = prod ? prod.id : null;
  const isApproved = data.status === "approved";

  const { data: inserted, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      customer_name: data.name,
      rating: data.rating,
      comment: data.text,
      is_approved: isApproved,
      created_at: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
    })
    .select("*, products(name, slug)")
    .single();
  if (error) throw error;
  return mapReview(inserted);
}

export async function deleteReview(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
