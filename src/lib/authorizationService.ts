// Authorization Service - Permission checking and role validation
// Handles all authorization logic for the application

import { supabase } from './supabaseClient';
import { permissionCache } from './permissionCache';
import type {
  AuthUser,
  Role,
  Permission,
  RoleType,
  Resource,
  Action,
  PermissionCheckResult,
  School,
} from '@/types/rbac';

export class AuthorizationService {
  /**
   * Check if user has a specific role
   */
  static hasRole(user: AuthUser | null, role: RoleType): boolean {
    if (!user) return false;
    return user.roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  static hasAnyRole(user: AuthUser | null, roles: RoleType[]): boolean {
    if (!user) return false;
    return roles.some((role) => user.roles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  static hasAllRoles(user: AuthUser | null, roles: RoleType[]): boolean {
    if (!user) return false;
    return roles.every((role) => user.roles.includes(role));
  }

  /**
   * Check if user has specific permission (resource:action)
   */
  static hasPermission(user: AuthUser | null, resource: Resource, action: Action): boolean {
    if (!user) return false;

    const permissionString = `${resource}:${action}`;
    return user.permissions.includes(permissionString);
  }

  /**
   * Check if user has any of the specified permissions
   */
  static hasAnyPermission(user: AuthUser | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.some((perm) => user.permissions.includes(perm));
  }

  /**
   * Check if user has all of the specified permissions
   */
  static hasAllPermissions(user: AuthUser | null, permissions: string[]): boolean {
    if (!user) return false;
    return permissions.every((perm) => user.permissions.includes(perm));
  }

  /**
   * Check if user can access a specific school
   * Superadmins can access any school
   * Other roles can only access their school
   */
  static canAccessSchool(user: AuthUser | null, schoolId: string): boolean {
    if (!user) return false;

    // Superadmin can access all schools
    if (this.hasRole(user, 'superadmin')) return true;

    // Other users can only access their school
    return user.school_id === schoolId;
  }

  /**
   * Check if user can access a student's records
   * Based on role and relationships
   */
  static async canAccessStudent(user: AuthUser | null, studentId: number): Promise<boolean> {
    if (!user) return false;

    // Superadmin can access any student
    if (this.hasRole(user, 'superadmin')) return true;

    // School admin can access students in their school
    if (this.hasRole(user, 'schooladmin')) {
      const { data: student, error } = await supabase
        .from('students')
        .select('school_id')
        .eq('id', studentId)
        .single();

      if (error || !student) return false;
      return student.school_id === user.school_id;
    }

    // Students can access their own record
    if (this.hasRole(user, 'student')) {
      // Student ID in auth context matches the student ID
      // This would need to be stored in user profile
      return true; // RLS policy will enforce this
    }

    // Parents can access wards
    if (this.hasRole(user, 'parent')) {
      const { data: relationship, error } = await supabase
        .from('parent_student_relationships')
        .select('id')
        .eq('parent_id', user.id)
        .eq('student_id', studentId)
        .single();

      return !error && !!relationship;
    }

    // Teachers can access students in their classes
if (this.hasAnyRole(user, ['teacher', 'classteacher'])) {
  
  // Step 1: Pehle pata karo ki Student kis class/section mein padhta hai
  const { data: enrollment, error: enrollError } = await supabase
    .from('student_enrollments')
    .select('session_class_section_id')
    .eq('student_id', studentId)
    .eq('is_active', true) // Hamesha active enrollment check karein
    .maybeSingle();

  if (enrollError || !enrollment) return false;

  // Step 2: Check karo ki kya yeh Teacher us class/section ko padhata hai?
  const { data: assignment, error: assignError } = await supabase
    .from('teacher_class_assignments')
    .select('id')
    .eq('user_id', user.id)
    .eq('session_class_section_id', enrollment.session_class_section_id)
    .maybeSingle();

  // Agar assignment mil gaya, matlab teacher padhata hai (true return hoga)
  return !assignError && !!assignment;
}

    return false;
  }

  /**
   * Check if user can modify a student's records
   */
  static async canModifyStudent(user: AuthUser | null, studentId: number): Promise<boolean> {
    if (!user) return false;

    // Only superadmin and school admin can modify students
    if (!this.hasAnyRole(user, ['superadmin', 'schooladmin'])) return false;

    // For school admin, verify it's their school
    if (this.hasRole(user, 'schooladmin')) {
      return this.canAccessStudent(user, studentId);
    }

    return true;
  }

  /**
   * Check if user can view fee records
   */
  static async canViewFeeRecords(user: AuthUser | null, studentId: number): Promise<boolean> {
    if (!user) return false;

    // Can view if has permission and can access student
    return (
      this.hasPermission(user, 'fee_records', 'read') && (await this.canAccessStudent(user, studentId))
    );
  }

  /**
   * Check if user can enter marks for an exam
   */
  static async canEnterMarks(user: AuthUser | null, examScheduleId: number): Promise<boolean> {
    if (!user) return false;

    // Only teachers can enter marks
    if (!this.hasAnyRole(user, ['teacher', 'classteacher'])) return false;

    // Verify they teach the subject for this exam
    const { data: schedule, error: scheduleError } = await supabase
      .from('exam_schedules')
      .select('class_id, subject_id')
      .eq('id', examScheduleId)
      .single();

    if (scheduleError || !schedule) return false;

    const { data: assignment, error: assignmentError } = await supabase
      .from('teacher_class_assignments')
      .select('id')
      .eq('user_id', user.id)
      .eq('subject_id', schedule.subject_id)
      .single();

    return !assignmentError && !!assignment;
  }

  /**
   * Get all capabilities for a user based on their roles
   */
  static getCapabilities(user: AuthUser | null) {
    if (!user) {
      return {
        canManageSchools: false,
        canManageUsers: false,
        canManageStudents: false,
        canViewFees: false,
        canManageFees: false,
        canEnterMarks: false,
        canViewMarks: false,
        canViewReports: false,
        canExportData: false,
        canViewAuditLogs: false,
      };
    }

    const isSuperAdmin = this.hasRole(user, 'superadmin');
    const isSchoolAdmin = this.hasRole(user, 'schooladmin');
    const isTeacher = this.hasAnyRole(user, ['teacher', 'classteacher']);
    const isStudent = this.hasRole(user, 'student');
    const isParent = this.hasRole(user, 'parent');

    return {
      canManageSchools: isSuperAdmin,
      canManageUsers: isSuperAdmin || isSchoolAdmin,
      canManageStudents: isSuperAdmin || isSchoolAdmin,
      canViewFees: isSuperAdmin || isSchoolAdmin || isStudent || isParent,
      canManageFees: isSuperAdmin || isSchoolAdmin,
      canEnterMarks: isTeacher,
      canViewMarks: isTeacher || isStudent || isParent,
      canViewReports: isSuperAdmin || isSchoolAdmin || isTeacher || isStudent || isParent,
      canExportData: isSuperAdmin || isSchoolAdmin,
      canViewAuditLogs: isSuperAdmin || isSchoolAdmin,
    };
  }

  /**
   * Fetch and cache user permissions from database
   */
  static async fetchUserPermissions(userId: string): Promise<Permission[]> {
    // Check cache first
    const cached = permissionCache.getUserPermissions(userId);
    if (cached) return cached;

    // Fetch from database
    const { data, error } = await supabase.rpc('get_user_permissions', {
      user_uuid: userId,
    });

    if (error || !data) {
      console.error('Error fetching permissions:', error);
      return [];
    }

    // Format the response and cache it
    const permissions = data.map((p: any) => ({
      resource: p.resource,
      action: p.action,
      id: p.permission_id,
    }));

    permissionCache.cacheUserPermissions(userId, permissions);
    return permissions;
  }

  /**
   * Fetch and cache user roles from database
   */
  static async fetchUserRoles(userId: string): Promise<Role[]> {
    // Check cache first
    const cached = permissionCache.getUserRoles(userId);
    if (cached) return cached;

    // Fetch from database
    const { data, error } = await supabase
      .from('user_roles')
      .select('role:roles(*)')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error || !data) {
      console.error('Error fetching roles:', error);
      return [];
    }

    const roles = data.map((ur: any) => ur.role).filter(Boolean);
    permissionCache.cacheUserRoles(userId, roles);
    return roles;
  }

  /**
   * Get school info for user
   */
static async getUserSchool(userId: string): Promise<School | null> {
    const { data, error } = await supabase
      .from('schools')
      // !inner ka matlab hai: Wahi school do jiska profile se link ho
      .select('*, profiles!inner(id)') 
      .eq('profiles.id', userId)
      .single();

    if (error || !data) return null;

    // Yahan TypeScript bilkul rotega nahi kyunki main query 'schools' table ki hi hai!
    return data as School; 
}

  /**
   * Build complete auth user with all RBAC context
   */
  static async buildAuthUser(userProfile: any): Promise<AuthUser> {
    const userId = userProfile.id;

    // Fetch roles and permissions in parallel
    const [roles, permissions, school] = await Promise.all([
      this.fetchUserRoles(userId),
      this.fetchUserPermissions(userId),
      this.getUserSchool(userId),
    ]);

    const roleNames = roles.map((r) => r.name);
    const permissionStrings = permissions.map((p) => `${p.resource}:${p.action}`);

    return {
      ...userProfile,
      roles: roleNames,
      roleDetails: roles,
      permissions: permissionStrings,
      permissionDetails: permissions,
      school: school,
      isSuperAdmin: roleNames.includes('superadmin'),
      isSchoolAdmin: roleNames.includes('schooladmin'),
      isTeacher: roleNames.includes('teacher'),
      isClassTeacher: roleNames.includes('classteacher'),
      isStudent: roleNames.includes('student'),
      isParent: roleNames.includes('parent'),
    };
  }

  /**
   * Check if a permission exists or deny with reason
   */
  static checkPermission(
    user: AuthUser | null,
    resource: Resource,
    action: Action
  ): PermissionCheckResult {
    if (!user) {
      return {
        allowed: false,
        reason: 'User not authenticated',
      };
    }

    if (!this.hasPermission(user, resource, action)) {
      return {
        allowed: false,
        reason: `User does not have permission to ${action} ${resource}`,
      };
    }

    return {
      allowed: true,
    };
  }

  /**
   * Invalidate user's permission cache when roles change
   */
  static invalidateUserCache(userId: string): void {
    permissionCache.invalidateUserCache(userId);
  }
}
