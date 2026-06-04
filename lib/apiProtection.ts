// API Route Protection Utilities
// Helper functions for protecting API endpoints with role and permission checks

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { AuthService } from './authService'
import { AuthorizationService } from './authorizationService'
import type { RoleType, Resource, Action } from '@/app/types/rbac'

/**
 * Get authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
       cookies: {
          getAll() {
            return request.cookies.getAll()
           },
        },
      }
    )

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user with RBAC context
    return await AuthService.getUserWithContext(user.id)
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Return 401 Unauthorized response
 */
export function unauthorized(message: string = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 })
}

/**
 * Return 403 Forbidden response
 */
export function forbidden(message: string = 'Access denied') {
  return NextResponse.json({ error: message }, { status: 403 })
}

/**
 * Return 400 Bad Request response
 */
export function badRequest(message: string = 'Invalid request') {
  return NextResponse.json({ error: message }, { status: 400 })
}

/**
 * Return 500 Internal Server Error response
 */
export function serverError(message: string = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 })
}

/**
 * Success response with data
 */
export function success(data: any, status: number = 200) {
  return NextResponse.json({ data }, { status })
}

/**
 * Require authentication on API route
 * Usage: const user = await requireAuth(request)
 */
export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    throw unauthorized('Authentication required')
  }

  return user
}

/**
 * Require specific role
 * Usage: await requireRole(request, 'schooladmin')
 */
export async function requireRole(request: NextRequest, role: RoleType | RoleType[]) {
  const user = await requireAuth(request)

  const roles = Array.isArray(role) ? role : [role]
  if (!AuthorizationService.hasAnyRole(user, roles)) {
    throw forbidden(`Requires role: ${roles.join(', ')}`)
  }

  return user
}

/**
 * Require specific permission
 * Usage: await requirePermission(request, 'students', 'read')
 */
export async function requirePermission(request: NextRequest, resource: Resource, action: Action) {
  const user = await requireAuth(request)

  if (!AuthorizationService.hasPermission(user, resource, action)) {
    throw forbidden(`Requires permission: ${resource}:${action}`)
  }

  return user
}

/**
 * Require user to be school admin or superadmin
 */
export async function requireAdmin(request: NextRequest) {
  return requireRole(request, ['superadmin', 'schooladmin'])
}

/**
 * Require user to be superadmin
 */
export async function requireSuperAdmin(request: NextRequest) {
  return requireRole(request, 'superadmin')
}

/**
 * Require school access
 * Verifies user can access specified school
 */
export async function requireSchoolAccess(request: NextRequest, schoolId: string) {
  const user = await requireAuth(request)

  if (!AuthorizationService.canAccessSchool(user, schoolId)) {
    throw forbidden('Cannot access this school')
  }

  return user
}

/**
 * Create wrapper for API route with try-catch
 * Usage:
 * export const GET = apiRoute(async (request, user) => {
 *   return success({ message: 'Hello' })
 * })
 */
export function apiRoute(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    try {
      const user = await requireAuth(request)
      return await handler(request, user)
    } catch (error) {
      if (error instanceof Response) {
        return error
      }

      console.error('API error:', error)
      const message = error instanceof Error ? error.message : 'Internal server error'
      return serverError(message)
    }
  }
}

/**
 * Create wrapper for role-restricted API route
 */
export function apiRouteWithRole(
  roles: RoleType | RoleType[],
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return apiRoute(async (request, user) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles]
    if (!AuthorizationService.hasAnyRole(user, requiredRoles)) {
      return forbidden(`Requires role: ${requiredRoles.join(', ')}`)
    }

    return await handler(request, user)
  })
}

/**
 * Create wrapper for permission-restricted API route
 */
export function apiRouteWithPermission(
  resource: Resource,
  action: Action,
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return apiRoute(async (request, user) => {
    if (!AuthorizationService.hasPermission(user, resource, action)) {
      return forbidden(`Requires permission: ${resource}:${action}`)
    }

    return await handler(request, user)
  })
}

/**
 * Create wrapper for admin-only API route
 */
export function apiRouteAdminOnly(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return apiRouteWithRole(['superadmin', 'schooladmin'], handler)
}

/**
 * Extract user ID from headers (set by middleware)
 */
export function getUserIdFromHeaders(request: NextRequest): string | null {
  return request.headers.get('x-user-id')
}

/**
 * Extract user email from headers (set by middleware)
 */
export function getUserEmailFromHeaders(request: NextRequest): string | null {
  return request.headers.get('x-user-email')
}

/**
 * Parse request body safely
 */
export async function parseRequestBody(request: NextRequest) {
  try {
    return await request.json()
  } catch (error) {
    throw badRequest('Invalid JSON body')
  }
}

/**
 * Validate required fields in body
 */
export function validateRequired(data: any, fields: string[]): void {
  for (const field of fields) {
    if (!data[field]) {
      throw badRequest(`Missing required field: ${field}`)
    }
  }
}

/**
 * School context extraction
 * Gets school ID from request or user's school
 */
export async function getSchoolContext(request: NextRequest): Promise<string | null> {
  try {
    // Try from query params
    const schoolId = request.nextUrl.searchParams.get('school_id')
    if (schoolId) return schoolId

    // Get from user's context
    const user = await getAuthenticatedUser(request)
    if (user?.school_id) return user.school_id

    return null
  } catch (error) {
    console.error('Error getting school context:', error)
    return null
  }
}
