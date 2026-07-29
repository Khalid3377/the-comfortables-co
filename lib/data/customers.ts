import { Customer, Order } from "../types";
import { createAdminClient } from "../supabase/admin";
import { getOrders } from "./orders";

function mapCustomer(row: any): Customer {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    createdAt: row.created_at,
    joinedAt: row.created_at
  };
}

function mapCustomerToDb(c: Partial<Customer>): any {
  const dbRow: any = {};
  if (c.id !== undefined) dbRow.id = c.id;
  if (c.name !== undefined) dbRow.name = c.name;
  if (c.email !== undefined) dbRow.email = c.email;
  if (c.phone !== undefined) dbRow.phone = c.phone;
  return dbRow;
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapCustomer);
  } catch (error) {
    console.error("Error in getCustomers:", error);
    return [];
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCustomer(data) : null;
  } catch (error) {
    console.error("Error in getCustomerById:", error);
    return null;
  }
}

export async function getCustomerOrders(email: string): Promise<Order[]> {
  try {
    const orders = await getOrders();
    return orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  } catch (error) {
    console.error("Error in getCustomerOrders:", error);
    return [];
  }
}

export async function createCustomer(data: Customer): Promise<Customer> {
  const supabase = createAdminClient();
  const dbRow = mapCustomerToDb(data);
  const { data: inserted, error } = await supabase
    .from("customers")
    .insert(dbRow)
    .select()
    .single();
  if (error) throw error;
  return mapCustomer(inserted);
}
