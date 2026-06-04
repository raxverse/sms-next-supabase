// Permission Guard Components
// Conditional rendering based on roles and permissions

'use client'

import React from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import type { RoleType, Resource, Action } from '@/app/types/rbac'

/**
 * PermissionGuard - Hide content unless user has specific permission
 *
 * Usage:
 * <PermissionGuard resource="students" action="edit">
 *   <EditButton />
 * </PermissionGuard>
 */
interface PermissionGuardProps {
  resource: Resource
  action: Action
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission } = useAuth()

  if (!hasPermission(resource, action)) {
    return fallback
  }

  return <>{children}</>
}

/**
 * RoleGuard - Hide content unless user has specific role
 *
 * Usage:
 * <RoleGuard roles={['schooladmin']}>
 *   <AdminPanel />
 * </RoleGuard>
 */
interface RoleGuardProps {
  roles: RoleType | RoleType[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasRole, hasAnyRole } = useAuth()

  const hasAccess = Array.isArray(roles) ? hasAnyRole(roles) : hasRole(roles)

  if (!hasAccess) {
    return fallback
  }

  return <>{children}</>
}

/**
 * AnyRoleGuard - Hide content unless user has any of specified roles
 *
 * Usage:
 * <AnyRoleGuard roles={['teacher', 'classteacher', 'student']}>
 *   <StudentContent />
 * </AnyRoleGuard>
 */
interface AnyRoleGuardProps {
  roles: RoleType[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AnyRoleGuard({ roles, children, fallback = null }: AnyRoleGuardProps) {
  const { hasAnyRole } = useAuth()

  if (!hasAnyRole(roles)) {
    return fallback
  }

  return <>{children}</>
}

/**
 * AllRolesGuard - Hide content unless user has all specified roles
 *
 * Usage:
 * <AllRolesGuard roles={['schooladmin', 'superadmin']}>
 *   <SuperAdminContent />
 * </AllRolesGuard>
 */
interface AllRolesGuardProps {
  roles: RoleType[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AllRolesGuard({ roles, children, fallback = null }: AllRolesGuardProps) {
  const { hasAllRoles } = useAuth()

  if (!hasAllRoles(roles)) {
    return fallback
  }

  return <>{children}</>
}

/**
 * AdminGuard - Hide content unless user is admin (super or school)
 *
 * Usage:
 * <AdminGuard>
 *   <AdminSettings />
 * </AdminGuard>
 */
interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { hasAnyRole } = useAuth()

  if (!hasAnyRole(['superadmin', 'schooladmin'])) {
    return fallback
  }

  return <>{children}</>
}

/**
 * SuperAdminGuard - Hide content unless user is superadmin
 *
 * Usage:
 * <SuperAdminGuard>
 *   <SystemSettings />
 * </SuperAdminGuard>
 */
interface SuperAdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function SuperAdminGuard({ children, fallback = null }: SuperAdminGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole('superadmin')) {
    return fallback
  }

  return <>{children}</>
}

/**
 * TeacherGuard - Hide content unless user is teacher or classteacher
 */
interface TeacherGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function TeacherGuard({ children, fallback = null }: TeacherGuardProps) {
  const { hasAnyRole } = useAuth()

  if (!hasAnyRole(['teacher', 'classteacher'])) {
    return fallback
  }

  return <>{children}</>
}

/**
 * StudentGuard - Hide content unless user is student
 */
interface StudentGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function StudentGuard({ children, fallback = null }: StudentGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole('student')) {
    return fallback
  }

  return <>{children}</>
}

/**
 * ParentGuard - Hide content unless user is parent
 */
interface ParentGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ParentGuard({ children, fallback = null }: ParentGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole('parent')) {
    return fallback
  }

  return <>{children}</>
}

/**
 * ConditionalRender - Flexible conditional rendering
 *
 * Usage:
 * <ConditionalRender
 *   condition={authUser?.isSchoolAdmin}
 *   children={<AdminPanel />}
 *   fallback={<UserPanel />}
 * />
 */
interface ConditionalRenderProps {
  condition: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ConditionalRender({ condition, children, fallback = null }: ConditionalRenderProps) {
  if (!condition) {
    return fallback
  }

  return <>{children}</>
}

/**
 * Protected Button - Button that shows/hides based on permission
 *
 * Usage:
 * <ProtectedButton
 *   resource="students"
 *   action="delete"
 *   onClick={handleDelete}
 * >
 *   Delete Student
 * </ProtectedButton>
 */
interface ProtectedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  resource?: Resource
  action?: Action
  roles?: RoleType | RoleType[]
  children: React.ReactNode
  fallbackText?: string
}

export function ProtectedButton({
  resource,
  action,
  roles,
  children,
  fallbackText,
  ...buttonProps
}: ProtectedButtonProps) {
  const { hasPermission, hasRole, hasAnyRole } = useAuth()

  let hasAccess = true

  if (resource && action) {
    hasAccess = hasPermission(resource, action)
  } else if (roles) {
    hasAccess = Array.isArray(roles) ? hasAnyRole(roles) : hasRole(roles)
  }

  if (!hasAccess) {
    return (
      <button disabled title={fallbackText || 'No permission'} {...buttonProps}>
        {fallbackText || children}
      </button>
    )
  }

  return <button {...buttonProps}>{children}</button>
}

/**
 * Loading State for Auth
 */
interface AuthLoadingProps {
  children: React.ReactNode
  loadingComponent?: React.ReactNode
}

export function AuthLoading({ children, loadingComponent = <div>Loading...</div> }: AuthLoadingProps) {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <>{loadingComponent}</>
  }

  return <>{children}</>
}

/**
 * Authentication Required - Shows message if not authenticated
 */
interface RequireAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RequireAuth({ children, fallback = null }: RequireAuthProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return fallback
  }

  return <>{children}</>
}
