import { supabase } from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

type Student = Tables<'students'>
type StudentInsert = TablesInsert<'students'>
type StudentUpdate = TablesUpdate<'students'>
type Guardian = Tables<'guardians'>
type GuardianInsert = TablesInsert<'guardians'>
type StudentEnrollment = Tables<'student_enrollments'>
type StudentEnrollmentInsert = TablesInsert<'student_enrollments'>
type StudentQueryRow = Student & {
  guardian: Guardian | null
  school: { id: string; name: string } | null
  student_enrollments?: Array<StudentEnrollment & {
    session_class_sections?: {
      id: string
      classes?: { id: string; name: string } | null
      sections?: { id: string; name: string } | null
    } | null
  }> | null
}

export interface StudentWithDetails extends Student {
  guardian?: Guardian | null
  enrollment?: (StudentEnrollment & {
    session_class_section?: {
      id: string
      class?: { id: string; name: string } | null
      section?: { id: string; name: string } | null
    }
  }) | null
  school?: { id: string; name: string } | null
}

export interface CreateStudentData {
  // Student Data
  admission_number: string
  first_name: string
  last_name?: string
  dob: string
  gender?: string
  school_id: string

  // Guardian Data
  father_name?: string
  mother_name?: string
  primary_phone: string
  address?: string

  // Enrollment Data
  session_class_section_id?: string
  roll_number?: number
}

export interface StudentFilters {
  school_id?: string
  session_class_section_id?: string
  status?: string
  search?: string
}

/**
 * Get all students with optional filters
 */
export async function getStudents(filters?: StudentFilters): Promise<StudentWithDetails[]> {
  let query = supabase
    .from('students')
    .select(`
      *,
      guardian:guardians(*),
      school:schools(id, name),
      student_enrollments(
        *,
        session_class_sections(
          id,
          classes(id, name),
          sections(id, name)
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.school_id) {
    query = query.eq('school_id', filters.school_id)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,admission_number.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching students:', error)
    throw error
  }

  // Transform the data to match our interface
  return ((data || []) as StudentQueryRow[]).map((student) => ({
    ...student,
    enrollment: student.student_enrollments?.[0] ? {
      ...student.student_enrollments[0],
      session_class_section: student.student_enrollments[0]?.session_class_sections ? {
        id: student.student_enrollments[0].session_class_sections.id,
        class: student.student_enrollments[0].session_class_sections.classes ?? null,
        section: student.student_enrollments[0].session_class_sections.sections ?? null,
      } : undefined,
    } : null,
  }))
}

/**
 * Get a single student by ID
 */
export async function getStudentById(id: string): Promise<StudentWithDetails | null> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      guardian:guardians(*),
      school:schools(id, name),
      student_enrollments(
        *,
        session_class_sections(
          id,
          classes(id, name),
          sections(id, name)
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching student:', error)
    return null
  }

  return {
    ...data,
    enrollment: data.student_enrollments?.[0] || null,
  }
}

/**
 * Create a new student with guardian and enrollment
 */
export async function createStudent(studentData: CreateStudentData): Promise<StudentWithDetails> {
  // 1. Create guardian first
  const guardianInsert: GuardianInsert = {
    father_name: studentData.father_name || null,
    mother_name: studentData.mother_name || null,
    primary_phone: studentData.primary_phone,
    address: studentData.address || null,
    school_id: studentData.school_id,
  }

  const { data: guardian, error: guardianError } = await supabase
    .from('guardians')
    .insert(guardianInsert)
    .select()
    .single()

  if (guardianError || !guardian) {
    console.error('Error creating guardian:', guardianError)
    throw guardianError || new Error('Failed to create guardian')
  }

  // 2. Create student
  const studentInsert: StudentInsert = {
    admission_number: studentData.admission_number,
    first_name: studentData.first_name,
    last_name: studentData.last_name || null,
    dob: studentData.dob,
    gender: studentData.gender || null,
    guardian_id: guardian.id,
    school_id: studentData.school_id,
    status: 'active',
  }

  const { data: student, error: studentError } = await supabase
    .from('students')
    .insert(studentInsert)
    .select()
    .single()

  if (studentError || !student) {
    console.error('Error creating student:', studentError)
    // Try to cleanup guardian
    await supabase.from('guardians').delete().eq('id', guardian.id)
    throw studentError || new Error('Failed to create student')
  }

  // 3. Create enrollment if class section is provided
  if (studentData.session_class_section_id) {
    const enrollmentInsert: StudentEnrollmentInsert = {
      student_id: student.id,
      session_class_section_id: studentData.session_class_section_id,
      school_id: studentData.school_id,
      roll_number: studentData.roll_number || null,
      is_active: true,
    }

    const { error: enrollmentError } = await supabase
      .from('student_enrollments')
      .insert(enrollmentInsert)

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError)
      // Don't throw - student is created, enrollment can be added later
    }
  }

  // Return the created student with all details
  return getStudentById(student.id) as Promise<StudentWithDetails>
}

/**
 * Update a student
 */
export async function updateStudent(
  id: string,
  updates: Partial<StudentUpdate>
): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating student:', error)
    throw error
  }

  return data
}

/**
 * Delete a student (soft delete by setting status to 'deleted')
 */
export async function deleteStudent(id: string): Promise<void> {
  // Get student to find guardian
  const student = await getStudentById(id)

  // Update status to deleted (soft delete)
  const { error } = await supabase
    .from('students')
    .update({ status: 'deleted' })
    .eq('id', id)

  if (error) {
    console.error('Error deleting student:', error)
    throw error
  }

  // Optionally delete guardian if no other students reference it
  if (student?.guardian_id) {
    const { data: otherStudents } = await supabase
      .from('students')
      .select('id')
      .eq('guardian_id', student.guardian_id)
      .neq('id', id)
      .limit(1)

    if (!otherStudents || otherStudents.length === 0) {
      await supabase.from('guardians').delete().eq('id', student.guardian_id)
    }
  }
}

/**
 * Get student count for dashboard
 */
export async function getStudentCount(schoolId?: string): Promise<number> {
  let query = supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  if (schoolId) {
    query = query.eq('school_id', schoolId)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error counting students:', error)
    return 0
  }

  return count || 0
}

/**
 * Check if admission number is unique
 */
export async function isAdmissionNumberUnique(
  admissionNumber: string,
  schoolId: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from('students')
    .select('id')
    .eq('admission_number', admissionNumber)
    .eq('school_id', schoolId)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query.limit(1)

  if (error) {
    console.error('Error checking admission number:', error)
    return false
  }

  return !data || data.length === 0
}
