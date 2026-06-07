// Enhanced Authentication Service
// Handles user registration, role assignment, and session management

import { supabase } from './supabaseClient';
import { AuthorizationService } from './authorizationService';
import { permissionCache } from './permissionCache';
import type { AuthUser, RoleType, UserProfile, School } from '@/app/types/rbac';

export class AuthService {
  /**
   * Create a new user with role assignment and profile
   * Only superadmin or schooladmin can call this
   */
  static async createUserWithRole(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    roles: RoleType[],
    schoolId?: string
  ): Promise<{ user: any; error: any }> {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        return { user: null, error: authError };
      }

      const userId = authData.user.id;

      // 2. Create user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        school_id: schoolId || null,
        is_active: true,
      });

      if (profileError) {
        // Delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(userId);
        return { user: null, error: profileError };
      }

      // 3. Assign roles
      const { data: roleRecords, error: roleQueryError } = await supabase
        .from('roles')
        .select('id')
        .in('name', roles);

      if (roleQueryError || !roleRecords) {
        return { user: null, error: roleQueryError };
      }

      const userRoleInserts = roleRecords.map((role) => ({
        user_id: userId,
        role_id: role.id,
        school_id: schoolId || null,
        is_active: true,
      }));

      const { error: userRoleError } = await supabase.from('user_roles').insert(userRoleInserts);

      if (userRoleError) {
        return { user: null, error: userRoleError };
      }

      // 4. Audit log
      await this.createAuditLog(userId, 'USER_CREATED', 'users', userId, null, {
        email,
        roles,
        school_id: schoolId,
      });

      return { user: authData.user, error: null };
    } catch (error) {
      console.error('Error creating user with role:', error);
      return { user: null, error };
    }
  }

  /**
   * Update user roles
   * Invalidates cache after update
   */
  static async updateUserRoles(userId: string, roles: RoleType[], schoolId?: string): Promise<{ error: any }> {
    try {
      // 1. Get role IDs
      const { data: roleRecords, error: roleQueryError } = await supabase
        .from('roles')
        .select('id')
        .in('name', roles);

      if (roleQueryError || !roleRecords) {
        return { error: roleQueryError };
      }

      // 2. Delete existing roles for this user/school combo
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('school_id', schoolId || null);

      if (deleteError) {
        return { error: deleteError };
      }

      // 3. Insert new roles
      const userRoleInserts = roleRecords.map((role) => ({
        user_id: userId,
        role_id: role.id,
        school_id: schoolId || null,
        is_active: true,
      }));

      const { error: insertError } = await supabase.from('user_roles').insert(userRoleInserts);

      if (insertError) {
        return { error: insertError };
      }

      // 4. Audit log
      await this.createAuditLog(userId, 'ROLES_UPDATED', 'user_roles', userId, null, {
        roles,
        school_id: schoolId,
      });

      // 5. Invalidate cache
      AuthorizationService.invalidateUserCache(userId);

      return { error: null };
    } catch (error) {
      console.error('Error updating user roles:', error);
      return { error };
    }
  }

  /**
   * Deactivate user account
   */
  static async deactivateUser(userId: string): Promise<{ error: any }> {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (updateError) {
        return { error: updateError };
      }

      // Deactivate all roles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .update({ is_active: false })
        .eq('user_id', userId);

      if (rolesError) {
        return { error: rolesError };
      }

      // Audit log
      await this.createAuditLog(userId, 'USER_DEACTIVATED', 'users', userId, null, null);

      // Invalidate cache
      AuthorizationService.invalidateUserCache(userId);

      return { error: null };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return { error };
    }
  }

  /**
   * Activate user account
   */
  static async activateUser(userId: string): Promise<{ error: any }> {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId);

      if (updateError) {
        return { error: updateError };
      }

      // Activate all roles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .update({ is_active: true })
        .eq('user_id', userId);

      if (rolesError) {
        return { error: rolesError };
      }

      // Audit log
      await this.createAuditLog(userId, 'USER_ACTIVATED', 'users', userId, null, null);

      // Invalidate cache
      AuthorizationService.invalidateUserCache(userId);

      return { error: null };
    } catch (error) {
      console.error('Error activating user:', error);
      return { error };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select();

      if (!error) {
        await this.createAuditLog(userId, 'PROFILE_UPDATED', '  profiles', userId, null, updates);
        AuthorizationService.invalidateUserCache(userId);
      }

      return { data, error };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Get user with full auth context
   */
  static async getUserWithContext(userId: string): Promise<AuthUser | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return null;
      }

      return AuthorizationService.buildAuthUser(profile);
    } catch (error) {
      console.error('Error getting user with context:', error);
      return null;
    }
  }

  /**
   * Check if user account is active
   */
  static async isUserActive(userId: string): Promise<boolean> {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('is_active')
        .eq('id', userId)
        .single();

      return !error && profile?.is_active === true;
    } catch (error) {
      console.error('Error checking user active status:', error);
      return false;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, newPassword: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (!error) {
        await this.createAuditLog(userId, 'PASSWORD_CHANGED', 'users', userId, null, null);
      }

      return { error };
    } catch (error) {
      console.error('Error changing password:', error);
      return { error };
    }
  }

  /**
   * Create audit log entry
   */
  private static async createAuditLog(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string | null,
    oldValues: any,
    newValues: any
  ): Promise<void> {
    try {
      // Get user's school context
      const user = await this.getUserWithContext(userId);

      await supabase.from('audit_logs').insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        old_values: oldValues,
        new_values: newValues,
        school_id: user?.school_id || null,
        ip_address: null, // Would be set from request in API route
        user_agent: null, // Would be set from request in API route
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }

  /**
   * Assign teacher to class and subject
   */
  static async assignTeacherToClass(
    teacherId: string,
    sessionClassSectionId: number,
    subjectId: number | null,
    isClassTeacher: boolean
  ): Promise<{ error: any }> {
    try {
      // Get teacher's school
      const teacher = await this.getUserWithContext(teacherId);
      if (!teacher?.school_id) {
        return { error: 'Teacher must be associated with a school' };
      }

      const { error } = await supabase.from('teacher_class_assignments').insert({
        user_id: teacherId,
        school_id: teacher.school_id,
        session_class_section_id: sessionClassSectionId,
        subject_id: subjectId,
        is_class_teacher: isClassTeacher,
      });

      if (!error) {
        await this.createAuditLog(teacherId, 'TEACHER_ASSIGNED', 'teacher_class_assignments', null, null, {
          session_class_section_id: sessionClassSectionId,
          subject_id: subjectId,
          is_class_teacher: isClassTeacher,
        });

        AuthorizationService.invalidateUserCache(teacherId);
      }

      return { error };
    } catch (error) {
      console.error('Error assigning teacher to class:', error);
      return { error };
    }
  }

  /**
   * Link parent to student
   */
  static async linkParentToStudent(
    parentId: string,
    studentId: number,
    relationship: string
  ): Promise<{ error: any }> {
    try {
      // Get parent's school
      const parent = await this.getUserWithContext(parentId);
      if (!parent?.school_id) {
        return { error: 'Parent must be associated with a school' };
      }

      const { error } = await supabase.from('parent_student_relationships').insert({
        parent_id: parentId,
        student_id: studentId,
        school_id: parent.school_id,
        relationship,
      });

      if (!error) {
        await this.createAuditLog(parentId, 'PARENT_LINKED', 'parent_student_relationships', null, null, {
          student_id: studentId,
          relationship,
        });
      }

      return { error };
    } catch (error) {
      console.error('Error linking parent to student:', error);
      return { error };
    }
  }
}
