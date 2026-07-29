import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { readFileSync } from 'fs'
import { join } from 'path'

export function createAdminClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const envPath = join(process.cwd(), '.env.local')
      const envContent = readFileSync(envPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const parts = line.split('=')
        if (parts.length >= 2) {
          const key = parts[0].trim()
          const value = parts.slice(1).join('=').trim()
          process.env[key] = value
        }
      })
    } catch (e) {
      // ignore
    }
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
