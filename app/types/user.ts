export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  location: string | null
  designation: string | null
  created_at: string
  updated_at: string
}
