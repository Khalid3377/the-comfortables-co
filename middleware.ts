import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name, value, options))
        },
      },
    }
  )

  const { data: { user } } =
    await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /account routes
  if (path.startsWith('/account') && !user) {
    return NextResponse.redirect(
      new URL('/auth/login?next=/account', request.url)
    )
  }

  // Protect /admin routes (existing logic)
  if (path.startsWith('/admin') &&
      !path.startsWith('/admin/login')) {
    // Check existing admin cookie/session
    const adminSession =
      request.cookies.get('admin_session')
    if (!adminSession) {
      return NextResponse.redirect(
        new URL('/admin/login', request.url)
      )
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*',
    '/checkout/:path*',
  ]
}
