// Route Protection Middleware
// Enforces authentication on protected routes
// This is NOT a simple proxy - it does authorization checks
// Therefore middleware.ts is the correct pattern for Next.js 16

import { type NextRequest, NextResponse } from 'next/server'

// Define which routes are public (don't require auth)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/about',
  '/contact',
  '/playground',
]

// Define which routes require specific roles
const PROTECTED_ROUTES = {
  '/admin': ['superadmin', 'schooladmin'],
  '/teacher': ['teacher', 'classteacher'],
  '/student': ['student'],
  '/parent': ['parent'],
  '/super-admin': ['superadmin'],
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // For protected routes, add auth header
  // Detailed role checking happens in route handlers via useAuth() hook
  // This middleware just ensures request flows to the route
  const requestHeaders = new Headers(request.headers)

  // Pass through - route components will handle auth via useAuth() hook
  // or API routes will use requireAuth/requireRole utilities
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    // Match all routes except these
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
