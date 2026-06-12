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

export interface Student {
  id: string;
  profile_id?: string;
  admission_number: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
}
