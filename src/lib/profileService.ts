import { supabase } from './supabaseClient'
import type { Tables, TablesUpdate, TablesInsert } from '@/types/database'

export type UserProfile = Tables<'profiles'>
export type UserProfileUpdate = TablesUpdate<'profiles'>
export type UserProfileInsert = TablesInsert<'profiles'>

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: UserProfileUpdate): Promise<UserProfile> {
  const safeUpdates: UserProfileUpdate = {
    ...updates,
    id: undefined,
    email: undefined,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select('*')
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }

  return data
}

export async function createUserProfile(userId: string, email: string, profile?: Partial<UserProfileInsert>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      first_name: profile?.first_name || 'User',
      last_name: profile?.last_name ?? null,
      role_id: profile?.role_id ?? null,
      school_id: profile?.school_id ?? null,
      is_active: profile?.is_active ?? true,
    })
    .select('*')
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }

  return data
}
