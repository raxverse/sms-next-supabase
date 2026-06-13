import type { Tables, Json } from './database'

export type ProfileRow = Tables<'profiles'>
export type RoleRow = Tables<'roles'>
export type SchoolRow = Tables<'schools'>
export type StudentRow = Tables<'students'>
export type SessionRow = Tables<'sessions'>
export type SessionClassSectionRow = Tables<'session_class_sections'>
export type SubjectRow = Tables<'subjects'>
export type ExamRow = Tables<'exams'>
export type MarkRow = Tables<'marks'>
export type AttendanceRow = Tables<'attendance'>

export type RoleType =
  | 'superadmin'
  | 'schooladmin'
  | 'principal'
  | 'teacher'
  | 'classteacher'
  | 'student'
  | 'parent'
  | 'accountant'
  | 'librarian'
  | 'deo'
  | 'clerk'

export type Resource =
  | 'schools'
  | 'users'
  | 'students'
  | 'fee_records'
  | 'fee_payments'
  | 'exams'
  | 'exam_marks'
  | 'results'
  | 'classes'
  | 'class_assignments'
  | 'assignments'
  | 'quizzes'
  | 'question_papers'
  | 'reports'
  | 'attendance'
  | 'settings'
  | 'audit_logs'
  | 'user_roles'

export type Action = 'create' | 'read' | 'update' | 'delete' | 'list' | 'assign' | 'revoke' | 'enroll' | 'export'

export type PermissionCategory =
  | 'school_management'
  | 'user_management'
  | 'student_management'
  | 'fee_management'
  | 'exam_management'
  | 'class_management'
  | 'academic_content'
  | 'reports'
  | 'system_settings'

export interface Role {
  id: number
  role_name: RoleType
  name: RoleType
  description: string | null
  display_name: string
  is_system_role: boolean
  created_at: string | null
}

export interface Permission {
  id: string
  resource: Resource
  action: Action
  description: string
  category: PermissionCategory
  created_at: string | null
}

export type School = SchoolRow
export type UserProfile = ProfileRow
export type Session = SessionRow
export type SessionClassSection = SessionClassSectionRow
export type Subject = SubjectRow
export type Exam = ExamRow
export type ExamMark = MarkRow
export type Student = StudentRow
export type AttendanceRecord = AttendanceRow

export interface AuthUser extends UserProfile {
  roles: RoleType[]
  roleDetails: Role[]
  permissions: string[]
  permissionDetails: Permission[]
  school: School | null
  isSuperAdmin: boolean
  isSchoolAdmin: boolean
  isTeacher: boolean
  isClassTeacher: boolean
  isStudent: boolean
  isParent: boolean
}

export interface AuthorizationContext {
  user: AuthUser | null
  isAuthenticated: boolean
  userSchoolId: string | null
}

export interface PermissionCheckResult {
  allowed: boolean
  reason?: string
}

export interface PermissionCheckOptions {
  resource: Resource
  action: Action
  schoolId?: string
  targetUserId?: string
  targetStudentId?: string
}

export interface TeacherClassAssignment {
  id: string
  user_id: string
  school_id: string
  session_class_section_id: string
  subject_id: string | null
  is_class_teacher: boolean
  created_at: string | null
}

export interface TeacherClassAssignmentWithDetails extends TeacherClassAssignment {
  teacher: UserProfile
  session_class_section: SessionClassSection
  subject?: Subject
}

export interface ParentStudentRelationship {
  id: string
  parent_id: string
  student_id: string
  school_id: string
  relationship: string | null
  created_at: string | null
}

export interface ParentStudentRelationshipWithDetails extends ParentStudentRelationship {
  parent: UserProfile
  student: Student
}

export interface SuperAdminDashboardData {
  totalSchools: number
  totalUsers: number
  totalStudents: number
  systemHealth: { uptime: string; lastBackup: string; databaseSize: string }
}

export interface SchoolAdminDashboardData {
  schoolId: string
  schoolName: string
  totalStudents: number
  totalStaff: number
  totalClassRooms: number
  activeSession: Session | null
  feeCollection: { totalDue: number; totalCollected: number; percentageCollected: number }
  pendingApprovals: number
}

export interface TeacherDashboardData {
  assignedClasses: SessionClassSection[]
  assignedSubjects: Subject[]
  studentCount: number
  upcomingExams: Exam[]
  assignmentsCreated: number
}

export interface ClassTeacherDashboardData extends TeacherDashboardData {
  classPerformance: { averageMarks: number; passPercentage: number }
  classAttendance: { averageAttendance: number; presentStudents: number; absentStudents: number }
}

export interface StudentFeeStatus {
  totalDue: number
  totalPaid: number
  percentagePaid: number
}

export interface StudentDashboardData {
  studentId: string
  studentName: string
  currentClass: SessionClassSection | null
  feeStatus: StudentFeeStatus
  recentMarks: ExamMark[]
  attendance: { totalDays: number; presentDays: number; percentage: number }
}

export interface ParentDashboardData {
  wards: Array<{
    studentId: string
    studentName: string
    currentClass: SessionClassSection | null
    feeStatus: StudentFeeStatus
    recentMarks: ExamMark[]
    attendance: AttendanceRecord
  }>
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string
  resource_id: string | null
  old_values: Json | null
  new_values: Json | null
  school_id: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string | null
}

export interface CacheEntry<T> { data: T; expiresAt: number }
export interface PermissionCache {
  userPermissions: Map<string, CacheEntry<Permission[]>>
  userRoles: Map<string, CacheEntry<Role[]>>
  schoolData: Map<string, CacheEntry<School>>
}

export interface CreateUserRequest { email: string; password: string; first_name?: string; last_name?: string; roles: RoleType[]; school_id?: string }
export interface UpdateUserRolesRequest { userId: string; roles: RoleType[]; schoolId?: string }
export interface AssignTeacherToClassRequest { teacherId: string; sessionClassSectionId: string; subjectId?: string | null; isClassTeacher: boolean }
export interface LinkParentStudentRequest { parentId: string; studentId: string; relationship: string }
