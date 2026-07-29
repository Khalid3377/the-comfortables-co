import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createCustomerRecord } from '@/lib/actions/auth'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await createCustomerRecord(
          user.id,
          user.user_metadata?.full_name || user.user_metadata?.name || 'Customer',
          user.email || '',
          user.phone || ''
        )
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
