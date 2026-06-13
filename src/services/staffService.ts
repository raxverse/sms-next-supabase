import { supabase } from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

type Profile = Tables<'profiles'>
type ProfileInsert = TablesInsert<'profiles'>
type ProfileUpdate = TablesUpdate<'profiles'>

export interface StaffMember extends Profile {
  role_name?: string
  school_name?: string
}

export interface CreateStaffData {
  email: string
  first_name: string
  last_name?: string
  school_id: string
  role_id?: number
  is_active?: boolean
}

export interface StaffFilters {
  school_id?: string
  role_id?: number
  is_active?: boolean
  search?: string
}

/**
 * Get all staff members with optional filters
 */
export async function getStaff(filters?: StaffFilters): Promise<StaffMember[]> {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      roles(id, role_name, description),
      schools(id, name)
    `)
    .order('created_at', { ascending: false })

  if (filters?.school_id) {
    query = query.eq('school_id', filters.school_id)
  }

  if (filters?.role_id) {
    query = query.eq('role_id', filters.role_id)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching staff:', error)
    throw error
  }

  // Transform data
  return (data || []).map((profile: any) => ({
    ...profile,
    role_name: profile.roles?.role_name || 'Unknown',
    school_name: profile.schools?.name || 'No School',
  }))
}

/**
 * Get a single staff member by ID
 */
export async function getStaffById(id: string): Promise<StaffMember | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      roles(id, role_name, description),
      schools(id, name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching staff member:', error)
    return null
  }

  return {
    ...data,
    role_name: data.roles?.role_name || 'Unknown',
    school_name: data.schools?.name || 'No School',
  }
}

/**
 * Create a new staff member (profile only - user auth should be created separately via AuthService)
 */
export async function createStaff(staffData: CreateStaffData): Promise<StaffMember> {
  const profileInsert: ProfileInsert = {
    id: crypto.randomUUID(), // This should be the auth user ID
    email: staffData.email,
    first_name: staffData.first_name,
    last_name: staffData.last_name || null,
    school_id: staffData.school_id,
    role_id: staffData.role_id || null,
    is_active: staffData.is_active ?? true,
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(profileInsert)
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating staff member:', error)
    throw error || new Error('Failed to create staff member')
  }

  return getStaffById(data.id) as Promise<StaffMember>
}

/**
 * Update a staff member
 */
export async function updateStaff(
  id: string,
  updates: Partial<ProfileUpdate>
): Promise<StaffMember> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating staff member:', error)
    throw error
  }

  return getStaffById(data.id) as Promise<StaffMember>
}

/**
 * Deactivate a staff member (soft delete)
 */
export async function deactivateStaff(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error deactivating staff member:', error)
    throw error
  }
}

/**
 * Activate a staff member
 */
export async function activateStaff(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      is_active: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error activating staff member:', error)
    throw error
  }
}

/**
 * Delete a staff member permanently
 */
export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting staff member:', error)
    throw error
  }
}

/**
 * Get staff count for dashboard
 */
export async function getStaffCount(schoolId?: string): Promise<number> {
  let query = supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  if (schoolId) {
    query = query.eq('school_id', schoolId)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error counting staff:', error)
    return 0
  }

  return count || 0
}

/**
 * Get all roles for dropdown
 */
export async function getRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching roles:', error)
    throw error
  }

  return data || []
}
