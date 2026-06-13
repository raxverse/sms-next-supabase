import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/about', '/contact']
const AUTH_ROUTES = ['/login', '/signup']
const PUBLIC_PREFIXES = ['/experiments']
const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  '/admin': ['superadmin', 'schooladmin', 'principal', 'teacher', 'classteacher', 'accountant', 'librarian', 'deo', 'clerk'],
  '/teacher': ['teacher', 'classteacher'],
  '/student': ['student'],
  '/parent': ['parent'],
  '/super-admin': ['superadmin'],
}

function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname) || AUTH_ROUTES.includes(pathname) || PUBLIC_PREFIXES.some((route) => pathname.startsWith(route))
}

function getRequiredRoles(pathname: string) {
  const match = Object.entries(ROLE_PROTECTED_ROUTES)
    .sort(([a], [b]) => b.length - a.length)
    .find(([route]) => pathname === route || pathname.startsWith(`${route}/`))
  return match?.[1] ?? null
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (isPublicPath(pathname)) {
    if (user && AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  if (!user) {
    const redirectUrl = new URL('/', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const requiredRoles = getRequiredRoles(pathname)
  if (!requiredRoles) return response

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_active, roles(role_name)')
    .eq('id', user.id)
    .maybeSingle()

  const roleRelation = profile?.roles as { role_name?: string } | { role_name?: string }[] | null | undefined
  const role = Array.isArray(roleRelation) ? roleRelation[0]?.role_name : roleRelation?.role_name
  const normalizedRole = role?.toLowerCase().replace(/[_\s-]/g, '')

  if (profile?.is_active === false || !normalizedRole || !requiredRoles.includes(normalizedRole)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  response.headers.set('x-user-id', user.id)
  if (user.email) response.headers.set('x-user-email', user.email)
  response.headers.set('x-user-role', normalizedRole)
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
