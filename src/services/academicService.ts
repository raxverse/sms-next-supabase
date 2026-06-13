import { supabase } from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

type Session = Tables<'sessions'>
type SessionInsert = TablesInsert<'sessions'>
type SessionUpdate = TablesUpdate<'sessions'>

type Class = Tables<'classes'>
type ClassInsert = TablesInsert<'classes'>
type ClassUpdate = TablesUpdate<'classes'>

type Section = Tables<'sections'>
type SectionInsert = TablesInsert<'sections'>
type SectionUpdate = TablesUpdate<'sections'>

type SessionClassSection = Tables<'session_class_sections'>
type SessionClassSectionInsert = TablesInsert<'session_class_sections'>
type SessionClassSectionUpdate = TablesUpdate<'session_class_sections'>

// ============================================================================
// SESSION SERVICES
// ============================================================================

export interface SessionWithDetails extends Session {
  school?: { id: string; name: string }
  class_sections?: Array<{
    id: string
    class_id: string
    section_id: string
    class?: { id: string; name: string }
    section?: { id: string; name: string }
  }>
}

export interface SessionFilters {
  school_id?: string
  is_active?: boolean
  is_current?: boolean
}

export async function getSessions(filters?: SessionFilters): Promise<SessionWithDetails[]> {
  let query = supabase
    .from('sessions')
    .select(`
      *,
      schools(id, name),
      session_class_sections(
        id,
        class_id,
        section_id,
        classes(id, name),
        sections(id, name)
      )
    `)
    .order('created_at', { ascending: false })

  if (filters?.school_id) {
    query = query.eq('school_id', filters.school_id)
  }

  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active)
  }

  if (filters?.is_current !== undefined) {
    query = query.eq('is_current', filters.is_current)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching sessions:', error)
    throw error
  }

  return data || []
}

export async function getSessionById(id: string): Promise<SessionWithDetails | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      schools(id, name),
      session_class_sections(
        id,
        class_id,
        section_id,
        classes(id, name),
        sections(id, name)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching session:', error)
    return null
  }

  return data
}

export async function createSession(sessionData: SessionInsert): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert(sessionData)
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating session:', error)
    throw error || new Error('Failed to create session')
  }

  return data
}

export async function updateSession(id: string, updates: SessionUpdate): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating session:', error)
    throw error
  }

  return data
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}

export async function setCurrentSession(id: string, schoolId: string): Promise<void> {
  // First, unset all current sessions for this school
  const { error: unsetError } = await supabase
    .from('sessions')
    .update({ is_current: false })
    .eq('school_id', schoolId)

  if (unsetError) {
    console.error('Error unsetting current sessions:', unsetError)
    throw unsetError
  }

  // Then set the specified session as current
  const { error: setError } = await supabase
    .from('sessions')
    .update({ is_current: true })
    .eq('id', id)

  if (setError) {
    console.error('Error setting current session:', setError)
    throw setError
  }
}

// ============================================================================
// CLASS SERVICES
// ============================================================================

export interface ClassWithDetails extends Class {
  school?: { id: string; name: string }
  sections?: Array<{ id: string; name: string }>
}

export interface ClassFilters {
  school_id?: string
}

export async function getClasses(filters?: ClassFilters): Promise<ClassWithDetails[]> {
  let query = supabase
    .from('classes')
    .select(`
      *,
      schools(id, name)
    `)
    .order('level', { ascending: true })

  if (filters?.school_id) {
    query = query.eq('school_id', filters.school_id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching classes:', error)
    throw error
  }

  return data || []
}

export async function getClassById(id: string): Promise<ClassWithDetails | null> {
  const { data, error } = await supabase
    .from('classes')
    .select(`
      *,
      schools(id, name)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching class:', error)
    return null
  }

  return data
}

export async function createClass(classData: ClassInsert): Promise<Class> {
  const { data, error } = await supabase
    .from('classes')
    .insert(classData)
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating class:', error)
    throw error || new Error('Failed to create class')
  }

  return data
}

export async function updateClass(id: string, updates: ClassUpdate): Promise<Class> {
  const { data, error } = await supabase
    .from('classes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating class:', error)
    throw error
  }

  return data
}

export async function deleteClass(id: string): Promise<void> {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting class:', error)
    throw error
  }
}

// ============================================================================
// SECTION SERVICES
// ============================================================================

export interface SectionWithDetails extends Section {
  school?: { id: string; name: string }
}

export interface SectionFilters {
  school_id?: string
}

export async function getSections(filters?: SectionFilters): Promise<SectionWithDetails[]> {
  let query = supabase
    .from('sections')
    .select(`
      *,
      schools(id, name)
    `)
    .order('name', { ascending: true })

  if (filters?.school_id) {
    query = query.eq('school_id', filters.school_id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching sections:', error)
    throw error
  }

  return data || []
}

export async function createSection(sectionData: SectionInsert): Promise<Section> {
  const { data, error } = await supabase
    .from('sections')
    .insert(sectionData)
    .select()
    .single()

  if (error || !data) {
    console.error('Error creating section:', error)
    throw error || new Error('Failed to create section')
  }

  return data
}

export async function updateSection(id: string, updates: SectionUpdate): Promise<Section> {
  const { data, error } = await supabase
    .from('sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating section:', error)
    throw error
  }

  return data
}

export async function deleteSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('sections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting section:', error)
    throw error
  }
}

// ============================================================================
// SESSION CLASS SECTION SERVICES
// ============================================================================

export interface SessionClassSectionWithDetails extends SessionClassSection {
  class?: { id: string; name: string; level?: number }
  section?: { id: string; name: string }
  session?: { id: string; session_name: string }
  class_teacher?: { id: string; first_name: string; last_name: string }
  school?: { id: string; name: string }
}

export interface SessionClassSectionFilters {
  school_id?: string
  session_id?: string
}

export async function getSessionClassSections(
  filters?: SessionClassSectionFilters
): Promise<SessionClassSectionWithDetails[]> {
  let query = supabase
    .from('session_class_sections')
    .select(`
      *,
      classes(id, name, level),
      sections(id, name),
      sessions(id, session_name),
      profiles!session_class_sections_class_teacher_id_fkey(id, first_name, last_name),
      schools(id, name)
    `)
    .order('created_at', { ascending: false })

  if (filters?.school_id) {
    query = query.eq('school_id', filters.school_id)
  }

  if (filters?.session_id) {
    query = query.eq('session_id', filters.session_id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching session class sections:', error)
    throw error
  }

  // Transform data
  return (data || []).map((item: any) => ({
    ...item,
    class: item.classes,
    section: item.sections,
    session: item.sessions,
    class_teacher: item.profiles,
  }))
}

export async function createSessionClassSection(
  data: SessionClassSectionInsert
): Promise<SessionClassSection> {
  const { data: result, error } = await supabase
    .from('session_class_sections')
    .insert(data)
    .select()
    .single()

  if (error || !result) {
    console.error('Error creating session class section:', error)
    throw error || new Error('Failed to create session class section')
  }

  return result
}

export async function updateSessionClassSection(
  id: string,
  updates: SessionClassSectionUpdate
): Promise<SessionClassSection> {
  const { data, error } = await supabase
    .from('session_class_sections')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating session class section:', error)
    throw error
  }

  return data
}

export async function deleteSessionClassSection(id: string): Promise<void> {
  const { error } = await supabase
    .from('session_class_sections')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting session class section:', error)
    throw error
  }
}
