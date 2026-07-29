import { Order } from "../types";
import { createAdminClient } from "../supabase/admin";

function mapOrder(row: any): Order {
  const metadata = typeof row.shipping_address === "string" ? { address: row.shipping_address } : (row.shipping_address || {});
  return {
    id: row.order_number,
    date: metadata.date || row.created_at,
    createdAt: metadata.createdAt || row.created_at,
    customerName: metadata.customerName || "",
    customerEmail: row.customer_email || "",
    customerPhone: metadata.customerPhone || "",
    shippingAddress: metadata.address || "",
    items: row.items || [],
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    total: Number(row.total),
    status: row.status,
    paymentStatus: metadata.paymentStatus || (row.status === "paid" ? "Paid" : row.status === "failed" ? "Failed" : row.status === "refunded" ? "Refunded" : "Pending"),
    fulfillmentStatus: metadata.fulfillmentStatus || "Unfulfilled",
    discountCode: metadata.discountCode || undefined
  };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapOrder);
  } catch (error) {
    console.error("Error in getOrders:", error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapOrder(data) : null;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return null;
  }
}

export async function createOrder(data: Order): Promise<Order> {
  const supabase = createAdminClient();
  const metadata = {
    address: data.shippingAddress || "",
    customerName: data.customerName || "",
    customerPhone: data.customerPhone || "",
    paymentStatus: data.paymentStatus || "Pending",
    fulfillmentStatus: data.fulfillmentStatus || "Unfulfilled",
    discountCode: data.discountCode || null,
    date: data.date || new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString()
  };

  const status = data.status === 'processing' ? 'paid' : data.status;

  const dbRow = {
    order_number: data.id,
    customer_email: data.customerEmail,
    status: status,
    items: data.items,
    subtotal: data.subtotal,
    discount: data.discount,
    total: data.total,
    shipping_address: metadata
  };

  const { data: inserted, error } = await supabase
    .from("orders")
    .insert(dbRow)
    .select()
    .single();
  if (error) throw error;
  return mapOrder(inserted);
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  const supabase = createAdminClient();
  const dbStatus = status === 'processing' ? 'paid' : status;
  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status: dbStatus })
    .eq("order_number", id)
    .select()
    .single();
  if (error) throw error;
  return mapOrder(updated);
}

export async function updateOrderStatuses(
  id: string,
  updates: Partial<Pick<Order, "status" | "paymentStatus" | "fulfillmentStatus">>
): Promise<Order> {
  const supabase = createAdminClient();
  
  // Get existing order to preserve other metadata
  const { data: existing, error: getErr } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", id)
    .maybeSingle();
  if (getErr) throw getErr;
  if (!existing) throw new Error("Order not found");

  const metadata: Record<string, unknown> = typeof existing.shipping_address === "object" && existing.shipping_address !== null && !Array.isArray(existing.shipping_address)
    ? { ...(existing.shipping_address as Record<string, unknown>) }
    : typeof existing.shipping_address === "string"
      ? { address: existing.shipping_address }
      : {};

  if (updates.paymentStatus !== undefined) metadata.paymentStatus = updates.paymentStatus;
  if (updates.fulfillmentStatus !== undefined) metadata.fulfillmentStatus = updates.fulfillmentStatus;

  const dbRow: any = {
    shipping_address: metadata
  };

  if (updates.status !== undefined) {
    dbRow.status = updates.status === 'processing' ? 'paid' : updates.status;
  }

  const { data: updated, error: updateErr } = await supabase
    .from("orders")
    .update(dbRow)
    .eq("order_number", id)
    .select()
    .single();
  if (updateErr) throw updateErr;
  return mapOrder(updated);
}
