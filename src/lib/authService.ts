import type { User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'
import { AuthorizationService } from './authorizationService'
import type { AuthUser, RoleType, UserProfile } from '@/types/rbac'
import type { TablesUpdate } from '@/types/database'

export class AuthService {
  static async createUserWithRole(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    roles: RoleType[],
    schoolId?: string
  ): Promise<{ user: User | null; error: unknown }> {
    try {
      const primaryRole = roles[0]
      const roleId = primaryRole ? await this.getRoleId(primaryRole) : null
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { first_name: firstName, last_name: lastName, role: primaryRole, school_id: schoolId ?? null } },
      })
      if (error || !data.user) return { user: null, error }

      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        first_name: firstName,
        last_name: lastName || null,
        school_id: schoolId ?? null,
        role_id: roleId,
        is_active: true,
      })

      if (profileError) return { user: null, error: profileError }
      AuthorizationService.invalidateUserCache(data.user.id)
      return { user: data.user, error: null }
    } catch (error) {
      console.error('Error creating user with role:', error)
      return { user: null, error }
    }
  }

  static async updateUserRoles(userId: string, roles: RoleType[], schoolId?: string): Promise<{ error: unknown }> {
    try {
      const roleId = roles[0] ? await this.getRoleId(roles[0]) : null
      const { error } = await supabase.from('profiles').update({ role_id: roleId, school_id: schoolId ?? null, updated_at: new Date().toISOString() }).eq('id', userId)
      if (!error) AuthorizationService.invalidateUserCache(userId)
      return { error }
    } catch (error) {
      console.error('Error updating user role:', error)
      return { error }
    }
  }

  static async deactivateUser(userId: string): Promise<{ error: unknown }> { return this.setUserActive(userId, false) }
  static async activateUser(userId: string): Promise<{ error: unknown }> { return this.setUserActive(userId, true) }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: unknown }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(this.toProfileUpdate(updates))
        .eq('id', userId)
        .select('*')
        .single()
      if (!error) AuthorizationService.invalidateUserCache(userId)
      return { data, error }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { data: null, error }
    }
  }

  static async updateLastLogin(userId: string): Promise<void> {
    try {
      await supabase.from('profiles').update({ updated_at: new Date().toISOString() }).eq('id', userId)
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }

  static async getUserWithContext(userId: string): Promise<AuthUser | null> {
    try {
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      if (error || !profile) return null
      return AuthorizationService.buildAuthUser(profile)
    } catch (error) {
      console.error('Error getting user with context:', error)
      return null
    }
  }

  static async isUserActive(userId: string): Promise<boolean> {
    try {
      const { data: profile, error } = await supabase.from('profiles').select('is_active').eq('id', userId).maybeSingle()
      return !error && profile?.is_active !== false
    } catch (error) {
      console.error('Error checking user active status:', error)
      return false
    }
  }

  static async changePassword(_userId: string, newPassword: string): Promise<{ error: unknown }> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      return { error }
    } catch (error) {
      console.error('Error changing password:', error)
      return { error }
    }
  }

  static async assignTeacherToClass(): Promise<{ error: unknown }> {
    return { error: 'Teacher assignments are not present in the generated database types yet.' }
  }

  static async linkParentToStudent(): Promise<{ error: unknown }> {
    return { error: 'Parent/student relationship table is not present in the generated database types yet.' }
  }

  private static async setUserActive(userId: string, isActive: boolean): Promise<{ error: unknown }> {
    try {
      const { error } = await supabase.from('profiles').update({ is_active: isActive, updated_at: new Date().toISOString() }).eq('id', userId)
      if (!error) AuthorizationService.invalidateUserCache(userId)
      return { error }
    } catch (error) {
      console.error('Error updating user active status:', error)
      return { error }
    }
  }

  private static async getRoleId(role: RoleType): Promise<number | null> {
    const { data } = await supabase.from('roles').select('id').ilike('role_name', role).maybeSingle()
    return data?.id ?? null
  }

  private static toProfileUpdate(updates: Partial<UserProfile>): TablesUpdate<'profiles'> {
    return {
      first_name: updates.first_name,
      last_name: updates.last_name,
      school_id: updates.school_id,
      role_id: updates.role_id,
      is_active: updates.is_active,
      updated_at: new Date().toISOString(),
    }
  }
}
