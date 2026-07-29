import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from "./types"

export async function createClient() {
  const cookieStore = await cookies()
  return createSSRServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

// Keep compatibility with existing files
export async function createServerClient() {
  return await createClient();
}

// Type matching the real notify_requests DB schema
export type NotifyRequestInsert = {
  product_slug?: string;
  email: string;
  size?: string;
  color?: string;
  variant_id?: string;
};

export async function insertNotifyRequest(
  supabase: any,
  payload: NotifyRequestInsert
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("notify_requests").insert(payload);

  return {
    error: error ? new Error(error.message) : null
  };
}
