"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createCustomerRecord } from "@/lib/actions/auth";
import type { Json } from "@/lib/supabase/types";

export type SavedAddress = {
  id: string;
  label?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutProfile = {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  defaultAddress: SavedAddress | null;
};

export type CustomerOrder = {
  id: string;
  order_number: string;
  customer_email: string | null;
  status: string;
  items: unknown;
  total: number;
  created_at: string;
};

export type SizeProfile = {
  chest: string;
  waist: string;
  hips: string;
  preferredFit: string;
};

export type NotificationPreferences = {
  emailAlerts: boolean;
  smsUpdates: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
};

export type CustomerSettings = {
  addresses?: SavedAddress[];
  size_profile?: SizeProfile;
  notification_preferences?: NotificationPreferences;
};

function parseAddresses(raw: unknown): SavedAddress[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (entry): entry is SavedAddress =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as SavedAddress).street === "string"
  );
}

function buildCheckoutProfile(customer: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  addresses: unknown;
}): CheckoutProfile {
  const addresses = parseAddresses(customer.addresses);
  return {
    customerId: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone ?? "",
    defaultAddress: addresses[0] ?? null,
  };
}

/** Resolve the authenticated user's internal customer record for checkout hydration. */
export async function fetchCheckoutProfile(): Promise<CheckoutProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  const admin = createAdminClient();
  let { data: customer } = await admin
    .from("customers")
    .select("id, name, email, phone, addresses")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!customer) {
    customer = await createCustomerRecord(
      user.id,
      user.user_metadata?.full_name || user.user_metadata?.name || "Customer",
      user.email ?? "",
      user.phone ?? ""
    );
  }

  return buildCheckoutProfile(customer);
}

/** Overwrite the customer's default (first) shipping address when opted in at checkout. */
export async function saveDefaultShippingAddress(
  customerId: string,
  address: Omit<SavedAddress, "id"> & { id?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const admin = createAdminClient();
  const { data: customer, error: fetchError } = await admin
    .from("customers")
    .select("id, addresses")
    .eq("id", customerId)
    .eq("auth_user_id", user.id)
    .single();

  if (fetchError || !customer) {
    return { success: false, error: "Customer profile not found" };
  }

  const existing = parseAddresses(customer.addresses);
  const defaultAddr: SavedAddress = {
    id: address.id ?? existing[0]?.id ?? `addr_${Date.now()}`,
    label: address.label ?? existing[0]?.label ?? "Home",
    street: address.street,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
  };

  const updatedAddresses =
    existing.length > 0 ? [defaultAddr, ...existing.slice(1)] : [defaultAddr];

  const { error: updateError } = await admin
    .from("customers")
    .update({ addresses: updatedAddresses })
    .eq("id", customerId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

/**
 * Persist account settings against customers.id after confirming that the
 * currently authenticated user owns that internal customer record.
 */
export async function saveCustomerSettings(
  customerId: string,
  settings: CustomerSettings
): Promise<{ success: boolean; error?: string }> {
  if (!customerId) return { success: false, error: "Customer profile is missing" };

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("saveCustomerSettings authentication error:", authError);
    return { success: false, error: "Not authenticated" };
  }

  const admin = createAdminClient();
  const { data: customer, error: customerError } = await admin
    .from("customers")
    .select("id")
    .eq("id", customerId)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (customerError || !customer) {
    console.error("saveCustomerSettings customer lookup error:", customerError);
    return { success: false, error: "Customer profile not found" };
  }

  const { error: updateError } = await admin
    .from("customers")
    .update(settings)
    .eq("id", customerId)
    .eq("auth_user_id", user.id);

  if (updateError) {
    console.error("saveCustomerSettings update error:", updateError);
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

/** Fetch order history using the internal customers.id UUID (not auth UUID). */
export async function fetchCustomerOrders(
  customerId: string
): Promise<CustomerOrder[]> {
  if (!customerId) return [];

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

  const admin = createAdminClient();
  const { data: customer } = await admin
    .from("customers")
    .select("id")
    .eq("id", customerId)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!customer) return [];

  const { data: orders, error } = await admin
    .from("orders")
    .select("id, order_number, customer_email, status, items, total, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchCustomerOrders error:", error);
    return [];
  }

  return (orders ?? []) as CustomerOrder[];
}
