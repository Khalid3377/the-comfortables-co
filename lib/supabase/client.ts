import { createBrowserClient } from '@supabase/ssr'
import type { Database } from "./types"

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Keep compatibility with existing files
export { createClient as createBrowserClient };

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type LoyaltyPointsSummary = {
  points_balance: number;
  lifetime_points: number;
  tier: string;
  updated_at: string;
};

export async function fetchLoyaltyPoints(
  supabase: any,
  userId: string
): Promise<{ data: LoyaltyPointsSummary | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("loyalty_points")
    .select("points_balance, lifetime_points, tier, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  return {
    data: data as LoyaltyPointsSummary | null,
    error: error ? new Error(error.message) : null
  };
}
