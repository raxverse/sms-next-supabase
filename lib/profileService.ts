import { supabase } from './supabaseClient'
import { UserProfile } from '@/app/types'

export type { UserProfile }

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  return data
}

export async function createUserProfile(userId: string, email: string, profile?: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      {
        id: userId,
        email,
        ...profile,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }

  return data
}
