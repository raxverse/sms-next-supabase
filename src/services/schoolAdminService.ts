import { supabase } from '@/lib/supabaseClient'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

export type School = Tables<'schools'>
export type SchoolInsert = TablesInsert<'schools'>
export type SchoolUpdate = TablesUpdate<'schools'>
export type ExamType = Tables<'exam_types'>
export type Exam = Tables<'exams'>
export type ExamInsert = TablesInsert<'exams'>
export type ExamUpdate = TablesUpdate<'exams'>
export type FeeType = Tables<'fee_types'>
export type FeeTypeInsert = TablesInsert<'fee_types'>
export type FeeTypeUpdate = TablesUpdate<'fee_types'>
export type FeeStructure = Tables<'fee_structures'>
export type FeeStructureInsert = TablesInsert<'fee_structures'>
export type FeeStructureUpdate = TablesUpdate<'fee_structures'>
export type StudentInvoice = Tables<'student_invoices'>
export type StudentInvoiceInsert = TablesInsert<'student_invoices'>
export type StudentInvoiceUpdate = TablesUpdate<'student_invoices'>
export type FeePayment = Tables<'fee_payments'>
export type FeePaymentInsert = TablesInsert<'fee_payments'>

export interface ExamWithDetails extends Exam {
  exam_types?: { id: string; name: string } | null
  sessions?: { id: string; session_name: string } | null
}

export interface FeeStructureWithDetails extends FeeStructure {
  fee_types?: { id: string; name: string } | null
  classes?: { id: string; name: string } | null
  sessions?: { id: string; session_name: string } | null
}

export interface InvoiceWithDetails extends StudentInvoice {
  students?: { id: string; first_name: string; last_name: string | null; admission_number: string } | null
  sessions?: { id: string; session_name: string } | null
}

export interface PaymentWithDetails extends FeePayment {
  student_invoices?: { id: string; invoice_month: string; students?: { first_name: string; last_name: string | null } | null } | null
}

export async function getSchools(schoolId?: string): Promise<School[]> {
  let query = supabase.from('schools').select('*').order('created_at', { ascending: false })
  if (schoolId) query = query.eq('id', schoolId)
  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function createSchool(data: SchoolInsert): Promise<School> {
  const { data: school, error } = await supabase.from('schools').insert(data).select('*').single()
  if (error) throw error
  return school
}

export async function updateSchool(id: string, updates: SchoolUpdate): Promise<School> {
  const { data, error } = await supabase.from('schools').update(updates).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteSchool(id: string): Promise<void> {
  const { error } = await supabase.from('schools').delete().eq('id', id)
  if (error) throw error
}

export async function getExamTypes(schoolId: string): Promise<ExamType[]> {
  const { data, error } = await supabase.from('exam_types').select('*').eq('school_id', schoolId).order('name')
  if (error) throw error
  return data ?? []
}

export async function createExamType(name: string, schoolId: string): Promise<ExamType> {
  const { data, error } = await supabase.from('exam_types').insert({ name, school_id: schoolId }).select('*').single()
  if (error) throw error
  return data
}

export async function getExams(schoolId: string): Promise<ExamWithDetails[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*, exam_types(id, name), sessions(id, session_name)')
    .eq('school_id', schoolId)
    .order('start_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createExam(data: ExamInsert): Promise<Exam> {
  const { data: exam, error } = await supabase.from('exams').insert(data).select('*').single()
  if (error) throw error
  return exam
}

export async function updateExam(id: string, updates: ExamUpdate): Promise<Exam> {
  const { data, error } = await supabase.from('exams').update(updates).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteExam(id: string): Promise<void> {
  const { error } = await supabase.from('exams').delete().eq('id', id)
  if (error) throw error
}

export async function getFeeTypes(schoolId: string): Promise<FeeType[]> {
  const { data, error } = await supabase.from('fee_types').select('*').eq('school_id', schoolId).order('name')
  if (error) throw error
  return data ?? []
}

export async function createFeeType(data: FeeTypeInsert): Promise<FeeType> {
  const { data: feeType, error } = await supabase.from('fee_types').insert(data).select('*').single()
  if (error) throw error
  return feeType
}

export async function updateFeeType(id: string, updates: FeeTypeUpdate): Promise<FeeType> {
  const { data, error } = await supabase.from('fee_types').update(updates).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteFeeType(id: string): Promise<void> {
  const { error } = await supabase.from('fee_types').delete().eq('id', id)
  if (error) throw error
}

export async function getFeeStructures(schoolId: string): Promise<FeeStructureWithDetails[]> {
  const { data, error } = await supabase
    .from('fee_structures')
    .select('*, fee_types(id, name), classes(id, name), sessions(id, session_name)')
    .eq('school_id', schoolId)
  if (error) throw error
  return data ?? []
}

export async function createFeeStructure(data: FeeStructureInsert): Promise<FeeStructure> {
  const { data: result, error } = await supabase.from('fee_structures').insert(data).select('*').single()
  if (error) throw error
  return result
}

export async function updateFeeStructure(id: string, updates: FeeStructureUpdate): Promise<FeeStructure> {
  const { data, error } = await supabase.from('fee_structures').update(updates).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function deleteFeeStructure(id: string): Promise<void> {
  const { error } = await supabase.from('fee_structures').delete().eq('id', id)
  if (error) throw error
}

export async function getStudentInvoices(schoolId: string): Promise<InvoiceWithDetails[]> {
  const { data, error } = await supabase
    .from('student_invoices')
    .select('*, students(id, first_name, last_name, admission_number), sessions(id, session_name)')
    .eq('school_id', schoolId)
    .order('due_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createStudentInvoice(data: StudentInvoiceInsert): Promise<StudentInvoice> {
  const { data: result, error } = await supabase.from('student_invoices').insert(data).select('*').single()
  if (error) throw error
  return result
}

export async function updateStudentInvoice(id: string, updates: StudentInvoiceUpdate): Promise<StudentInvoice> {
  const { data, error } = await supabase.from('student_invoices').update(updates).eq('id', id).select('*').single()
  if (error) throw error
  return data
}

export async function recordFeePayment(data: FeePaymentInsert): Promise<FeePayment> {
  const { data: payment, error } = await supabase.from('fee_payments').insert(data).select('*').single()
  if (error) throw error
  return payment
}
