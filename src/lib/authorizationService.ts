import { supabase } from './supabaseClient'
import { permissionCache } from './permissionCache'
import type { AuthUser, Role, Permission, RoleType, Resource, Action, PermissionCheckResult, School, UserProfile } from '@/types/rbac'

const ROLE_PERMISSIONS: Record<RoleType, Array<[Resource, Action]>> = {
  superadmin: [],
  schooladmin: [
    ['schools', 'read'], ['schools', 'update'], ['users', 'create'], ['users', 'read'], ['users', 'update'], ['users', 'list'], ['user_roles', 'assign'],
    ['students', 'create'], ['students', 'read'], ['students', 'update'], ['students', 'list'], ['students', 'enroll'],
    ['fee_records', 'read'], ['fee_records', 'create'], ['fee_records', 'update'], ['fee_payments', 'create'], ['fee_payments', 'read'], ['fee_payments', 'update'],
    ['exams', 'create'], ['exams', 'read'], ['exams', 'update'], ['classes', 'create'], ['classes', 'read'], ['classes', 'update'],
    ['class_assignments', 'create'], ['class_assignments', 'read'], ['class_assignments', 'update'], ['reports', 'read'], ['reports', 'export'], ['attendance', 'read'], ['settings', 'read'], ['settings', 'update'],
  ],
  principal: [['schools', 'read'], ['users', 'list'], ['students', 'list'], ['reports', 'read'], ['attendance', 'read']],
  teacher: [['students', 'read'], ['exam_marks', 'create'], ['exam_marks', 'read'], ['exam_marks', 'update'], ['classes', 'read'], ['class_assignments', 'read'], ['assignments', 'create'], ['assignments', 'read'], ['attendance', 'read']],
  classteacher: [['students', 'read'], ['students', 'update'], ['exam_marks', 'create'], ['exam_marks', 'read'], ['exam_marks', 'update'], ['classes', 'read'], ['class_assignments', 'read'], ['attendance', 'read']],
  student: [['students', 'read'], ['fee_records', 'read'], ['fee_payments', 'read'], ['exam_marks', 'read'], ['results', 'read'], ['attendance', 'read']],
  parent: [['students', 'read'], ['fee_records', 'read'], ['fee_payments', 'read'], ['exam_marks', 'read'], ['results', 'read'], ['attendance', 'read']],
  accountant: [['fee_records', 'read'], ['fee_records', 'create'], ['fee_records', 'update'], ['fee_payments', 'create'], ['fee_payments', 'read'], ['fee_payments', 'update'], ['reports', 'read']],
  librarian: [['students', 'read'], ['reports', 'read']],
  deo: [['students', 'create'], ['students', 'read'], ['students', 'update'], ['students', 'list']],
  clerk: [['students', 'read'], ['students', 'list'], ['fee_records', 'read']],
}

const ROLE_DISPLAY_NAMES: Record<RoleType, string> = {
  superadmin: 'Super Administrator', schooladmin: 'School Administrator', principal: 'Principal', teacher: 'Teacher', classteacher: 'Class Teacher', student: 'Student', parent: 'Parent', accountant: 'Accountant', librarian: 'Librarian', deo: 'Data Entry Operator', clerk: 'Clerk',
}

function normalizeRoleName(value: string | null | undefined): RoleType | null {
  if (!value) return null
  const normalized = value.toLowerCase().replace(/[_\s-]/g, '')
  const aliases: Record<string, RoleType> = { superadmin: 'superadmin', schooladmin: 'schooladmin', principal: 'principal', teacher: 'teacher', classteacher: 'classteacher', student: 'student', parent: 'parent', accountant: 'accountant', librarian: 'librarian', deo: 'deo', clerk: 'clerk' }
  return aliases[normalized] ?? null
}

function toPermission(resource: Resource, action: Action): Permission {
  return { id: `${resource}:${action}`, resource, action, description: `${action} ${resource}`, category: 'system_settings', created_at: null }
}

export class AuthorizationService {
  static hasRole(user: AuthUser | null, role: RoleType): boolean { return !!user && user.roles.includes(role) }
  static hasAnyRole(user: AuthUser | null, roles: RoleType[]): boolean { return !!user && roles.some((role) => user.roles.includes(role)) }
  static hasAllRoles(user: AuthUser | null, roles: RoleType[]): boolean { return !!user && roles.every((role) => user.roles.includes(role)) }
  static hasPermission(user: AuthUser | null, resource: Resource, action: Action): boolean { return !!user && user.permissions.includes(`${resource}:${action}`) }
  static hasAnyPermission(user: AuthUser | null, permissions: string[]): boolean { return !!user && permissions.some((perm) => user.permissions.includes(perm)) }
  static hasAllPermissions(user: AuthUser | null, permissions: string[]): boolean { return !!user && permissions.every((perm) => user.permissions.includes(perm)) }
  static canAccessSchool(user: AuthUser | null, schoolId: string): boolean { return !!user && (this.hasRole(user, 'superadmin') || user.school_id === schoolId) }

  static async canAccessStudent(user: AuthUser | null, studentId: string): Promise<boolean> {
    if (!user) return false
    if (this.hasRole(user, 'superadmin')) return true
    const { data: student } = await supabase.from('students').select('id, school_id, guardian_id').eq('id', studentId).maybeSingle()
    if (!student) return false
    if (this.hasAnyRole(user, ['schooladmin', 'principal', 'teacher', 'classteacher'])) return student.school_id === user.school_id
    if (this.hasRole(user, 'parent')) return student.guardian_id === user.id && student.school_id === user.school_id
    return this.hasRole(user, 'student') && student.id === user.id
  }

  static async canModifyStudent(user: AuthUser | null, studentId: string): Promise<boolean> { return this.hasAnyRole(user, ['superadmin', 'schooladmin']) && this.canAccessStudent(user, studentId) }
  static async canViewFeeRecords(user: AuthUser | null, studentId: string): Promise<boolean> { return this.hasPermission(user, 'fee_records', 'read') && (await this.canAccessStudent(user, studentId)) }
  static async canEnterMarks(user: AuthUser | null): Promise<boolean> { return this.hasAnyRole(user, ['teacher', 'classteacher']) && this.hasPermission(user, 'exam_marks', 'create') }

  static getCapabilities(user: AuthUser | null) {
    const isSuperAdmin = this.hasRole(user, 'superadmin')
    const isSchoolAdmin = this.hasRole(user, 'schooladmin')
    const isTeacher = this.hasAnyRole(user, ['teacher', 'classteacher'])
    const isStudent = this.hasRole(user, 'student')
    const isParent = this.hasRole(user, 'parent')
    return { canManageSchools: isSuperAdmin, canManageUsers: isSuperAdmin || isSchoolAdmin, canManageStudents: isSuperAdmin || isSchoolAdmin, canViewFees: isSuperAdmin || isSchoolAdmin || isStudent || isParent, canManageFees: isSuperAdmin || isSchoolAdmin, canEnterMarks: isTeacher, canViewMarks: isTeacher || isStudent || isParent, canViewReports: isSuperAdmin || isSchoolAdmin || isTeacher || isStudent || isParent, canExportData: isSuperAdmin || isSchoolAdmin, canViewAuditLogs: isSuperAdmin || isSchoolAdmin }
  }

  static async fetchUserRoles(userId: string): Promise<Role[]> {
    const cached = permissionCache.getUserRoles(userId)
    if (cached) return cached
    const { data, error } = await supabase.from('profiles').select('roles(id, role_name, description, created_at)').eq('id', userId).maybeSingle()
    if (error || !data?.roles) return []
    const rawRole = Array.isArray(data.roles) ? data.roles[0] : data.roles
    const roleName = normalizeRoleName(rawRole.role_name)
    if (!roleName) return []
    const role: Role = { id: rawRole.id, role_name: roleName, name: roleName, description: rawRole.description, display_name: ROLE_DISPLAY_NAMES[roleName], is_system_role: true, created_at: rawRole.created_at }
    permissionCache.cacheUserRoles(userId, [role])
    return [role]
  }

  static async fetchUserPermissions(userId: string): Promise<Permission[]> {
    const cached = permissionCache.getUserPermissions(userId)
    if (cached) return cached
    const roles = await this.fetchUserRoles(userId)
    const roleNames = roles.map((role) => role.name)
    const pairs = roleNames.includes('superadmin')
      ? Array.from(new Set(Object.values(ROLE_PERMISSIONS).flat().map(([r, a]) => `${r}:${a}`))).map((p) => p.split(':') as [Resource, Action])
      : roleNames.flatMap((role) => ROLE_PERMISSIONS[role] ?? [])
    const permissions = Array.from(new Map(pairs.map(([resource, action]) => [`${resource}:${action}`, toPermission(resource, action)])).values())
    permissionCache.cacheUserPermissions(userId, permissions)
    return permissions
  }

  static async getUserSchool(userId: string): Promise<School | null> {
    const { data: profile } = await supabase.from('profiles').select('school_id').eq('id', userId).maybeSingle()
    if (!profile?.school_id) return null
    const { data: school, error } = await supabase.from('schools').select('*').eq('id', profile.school_id).maybeSingle()
    return error ? null : school
  }

  static async buildAuthUser(userProfile: UserProfile): Promise<AuthUser> {
    const [roles, permissions, school] = await Promise.all([this.fetchUserRoles(userProfile.id), this.fetchUserPermissions(userProfile.id), this.getUserSchool(userProfile.id)])
    const roleNames = roles.map((role) => role.name)
    return { ...userProfile, roles: roleNames, roleDetails: roles, permissions: permissions.map((p) => `${p.resource}:${p.action}`), permissionDetails: permissions, school, isSuperAdmin: roleNames.includes('superadmin'), isSchoolAdmin: roleNames.includes('schooladmin'), isTeacher: roleNames.includes('teacher'), isClassTeacher: roleNames.includes('classteacher'), isStudent: roleNames.includes('student'), isParent: roleNames.includes('parent') }
  }

  static checkPermission(user: AuthUser | null, resource: Resource, action: Action): PermissionCheckResult {
    if (!user) return { allowed: false, reason: 'User not authenticated' }
    if (!this.hasPermission(user, resource, action)) return { allowed: false, reason: `User does not have permission to ${action} ${resource}` }
    return { allowed: true }
  }

  static invalidateUserCache(userId: string): void { permissionCache.invalidateUserCache(userId) }
}
