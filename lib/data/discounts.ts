import { DiscountCode } from "../types";
import { createAdminClient } from "../supabase/admin";

function mapDiscount(row: any): DiscountCode {
  return {
    code: row.code,
    type: row.type || "percentage",
    value: Number(row.value),
    usageLimit: row.usage_limit,
    usageCount: row.used_count || 0,
    expiryDate: row.expires_at ? row.expires_at.substring(0, 10) : "",
    active: row.is_active
  };
}

function mapDiscountToDb(d: Partial<DiscountCode>): any {
  const dbRow: any = {};
  if (d.code !== undefined) dbRow.code = d.code;
  if (d.type !== undefined) dbRow.type = d.type;
  if (d.value !== undefined) dbRow.value = d.value;
  if (d.usageLimit !== undefined) dbRow.usage_limit = d.usageLimit;
  if (d.usageCount !== undefined) dbRow.used_count = d.usageCount;
  if (d.expiryDate !== undefined) dbRow.expires_at = d.expiryDate ? new Date(d.expiryDate).toISOString() : null;
  if (d.active !== undefined) dbRow.is_active = d.active;
  return dbRow;
}

export async function getDiscounts(): Promise<DiscountCode[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapDiscount);
  } catch (error) {
    console.error("Error in getDiscounts:", error);
    return [];
  }
}

export async function getDiscountByCode(code: string): Promise<DiscountCode | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    return data ? mapDiscount(data) : null;
  } catch (error) {
    console.error("Error in getDiscountByCode:", error);
    return null;
  }
}

export async function createDiscount(data: DiscountCode): Promise<DiscountCode> {
  const supabase = createAdminClient();
  const dbRow = mapDiscountToDb(data);
  const { data: inserted, error } = await supabase
    .from("discount_codes")
    .insert(dbRow)
    .select()
    .single();
  if (error) throw error;
  return mapDiscount(inserted);
}

export async function updateDiscount(code: string, data: Partial<DiscountCode>): Promise<DiscountCode> {
  const supabase = createAdminClient();
  const dbRow = mapDiscountToDb(data);
  const { data: updated, error } = await supabase
    .from("discount_codes")
    .update(dbRow)
    .eq("code", code.toUpperCase())
    .select()
    .single();
  if (error) throw error;
  return mapDiscount(updated);
}

export async function deleteDiscount(code: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("discount_codes")
    .delete()
    .eq("code", code.toUpperCase());
  if (error) throw error;
}
