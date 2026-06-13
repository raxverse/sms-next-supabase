// Users API - Example of protected API routes with role and permission checks
// USAGE PATTERN FOR ALL API ENDPOINTS

import { NextRequest } from 'next/server'
import {
  requireAdmin,
  apiRouteAdminOnly,
  success,
  forbidden,
  badRequest,
  parseRequestBody,
  validateRequired,
  getSchoolContext,
} from '@/lib/apiProtection'
import { AuthService } from '@/lib/authService'
import { supabase } from '@/lib/supabaseClient'
import type { RoleType } from '@/types/rbac'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

/**
 * POST /api/admin/users
 * Create new user with role assignment
 * Requires: schooladmin or superadmin
 */
export const POST = apiRouteAdminOnly(async (request, user) => {
  try {
    const body = await parseRequestBody(request)

    // Validate required fields
    validateRequired(body, ['email', 'password', 'first_name', 'last_name', 'roles'])

    // Validate roles array
    if (!Array.isArray(body.roles) || body.roles.length === 0) {
      return badRequest('At least one role is required')
    }

    // Get school context
    const schoolId = await getSchoolContext(request)
    if (!user.isSuperAdmin && !schoolId) {
      return badRequest('School context required for non-superadmin users')
    }

    // School admin can only create users in their school
    if (!user.isSuperAdmin && schoolId !== user.school_id) {
      return forbidden('Cannot create users outside your school')
    }

    // Create user with role
    const { user: newUser, error } = await AuthService.createUserWithRole(
      body.email,
      body.password,
      body.first_name,
      body.last_name,
      body.roles as RoleType[],
      schoolId || undefined
    )

    if (error || !newUser) {
      return badRequest(errorMessage(error, 'Failed to create user'))
    }

    return success({ user: newUser }, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    const message = error instanceof Error ? error.message : 'Failed to create user'
    return badRequest(message)
  }
})

/**
 * GET /api/admin/users
 * List users in school
 * Requires: schooladmin or superadmin
 */
export const GET = apiRouteAdminOnly(async (request, user) => {
  try {
    // Get school context
    let schoolId = await getSchoolContext(request)

    // If school admin, filter to their school
    if (!user.isSuperAdmin) {
      schoolId = user.school_id
    }

    // Build query
    let query = supabase.from('profiles').select('id, email, first_name, last_name, is_active, created_at')

    // Filter by school if not superadmin
    if (schoolId && !user.isSuperAdmin) {
      query = query.eq('school_id', schoolId)
    }

    const { data: profiles, error } = await query

    if (error) {
      return badRequest(errorMessage(error, 'Request failed'))
    }

    return success({ users: profiles || [] })
  } catch (error) {
    console.error('Error fetching users:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch users'
    return badRequest(message)
  }
})

/**
 * PUT /api/admin/users/[id]/roles
 * Update user roles
 * Requires: schooladmin or superadmin
 */
export async function updateUserRoles(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin(request)

  try {
    const userId = params.id
    const body = await parseRequestBody(request)

    validateRequired(body, ['roles'])

    if (!Array.isArray(body.roles)) {
      return badRequest('Roles must be an array')
    }

    // Get school context
    const schoolId = await getSchoolContext(request)
    if (!user.isSuperAdmin && !schoolId) {
      return badRequest('School context required')
    }

    // Verify user can modify this user (same school)
    if (!user.isSuperAdmin) {
      const { data: targetUser, error } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', userId)
        .single()

      if (error || !targetUser) {
        return badRequest('User not found')
      }

      if (targetUser.school_id !== user.school_id) {
        return forbidden('Cannot modify users outside your school')
      }
    }

    // Update roles
    const { error } = await AuthService.updateUserRoles(userId, body.roles as RoleType[], schoolId || undefined)

    if (error) {
      return badRequest(errorMessage(error, 'Request failed'))
    }

    return success({ message: 'User roles updated' })
  } catch (error) {
    console.error('Error updating user roles:', error)
    const message = error instanceof Error ? error.message : 'Failed to update user roles'
    return badRequest(message)
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Deactivate user
 * Requires: schooladmin or superadmin
 */
export async function deleteUser(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin(request)

  try {
    const userId = params.id

    // Verify user can modify this user
    if (!user.isSuperAdmin) {
      const { data: targetUser, error } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', userId)
        .single()

      if (error || !targetUser) {
        return badRequest('User not found')
      }

      if (targetUser.school_id !== user.school_id) {
        return forbidden('Cannot delete users outside your school')
      }
    }

    // Deactivate user
    const { error } = await AuthService.deactivateUser(userId)

    if (error) {
      return badRequest(errorMessage(error, 'Request failed'))
    }

    return success({ message: 'User deactivated' })
  } catch (error) {
    console.error('Error deleting user:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete user'
    return badRequest(message)
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user profile
 * Requires: schooladmin or superadmin
 */
export async function updateUser(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAdmin(request)

  try {
    const userId = params.id
    const body = await parseRequestBody(request)

    // Verify user can modify this user
    if (!user.isSuperAdmin) {
      const { data: targetUser, error } = await supabase
        .from('profiles')
        .select('school_id')
        .eq('id', userId)
        .single()

      if (error || !targetUser) {
        return badRequest('User not found')
      }

      if (targetUser.school_id !== user.school_id) {
        return forbidden('Cannot modify users outside your school')
      }
    }

    // Update profile
    const { error } = await AuthService.updateUserProfile(userId, body)

    if (error) {
      return badRequest(errorMessage(error, 'Request failed'))
    }

    return success({ message: 'User updated' })
  } catch (error) {
    console.error('Error updating user:', error)
    const message = error instanceof Error ? error.message : 'Failed to update user'
    return badRequest(message)
  }
}
