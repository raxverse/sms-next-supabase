// RBAC Type Definitions for School Management System
// Comprehensive types for role-based access control and multi-tenancy

// ============================================================================
// ROLE TYPES
// ============================================================================

export type RoleType = 'superadmin' | 'schooladmin' | 'teacher' | 'classteacher' | 'student' | 'parent';

export interface Role {
  id: string;
  name: RoleType;
  description: string;
  display_name: string;
  is_system_role: boolean;
  created_at: string;
}

// ============================================================================
// PERMISSION TYPES
// ============================================================================

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
  | 'user_roles';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'list' | 'assign' | 'revoke' | 'enroll' | 'export';

export type PermissionCategory =
  | 'school_management'
  | 'user_management'
  | 'student_management'
  | 'fee_management'
  | 'exam_management'
  | 'class_management'
  | 'academic_content'
  | 'reports'
  | 'system_settings';

export interface Permission {
  id: string;
  resource: Resource;
  action: Action;
  description: string;
  category: PermissionCategory;
  created_at: string;
}

// ============================================================================
// USER ROLE TYPES
// ============================================================================

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  school_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleWithDetails extends UserRole {
  role: Role;
  school?: School;
}

// ============================================================================
// SCHOOL TYPES
// ============================================================================

export interface School {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  principal_name: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// AUTHENTICATED USER TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  designation: string | null;
  school_id: string | null;
  is_active: boolean;
  phone_verified: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Extended authenticated user with RBAC context
 * This is what AuthProvider provides to the app
 */
export interface AuthUser extends UserProfile {
  // Role information
  roles: RoleType[];
  roleDetails: Role[];

  // Permission information
  permissions: string[]; // Formatted as "resource:action"
  permissionDetails: Permission[];

  // Multi-tenancy context
  school: School | null;

  // Convenience flags
  isSuperAdmin: boolean;
  isSchoolAdmin: boolean;
  isTeacher: boolean;
  isClassTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
}

// ============================================================================
// TEACHER ASSIGNMENT TYPES
// ============================================================================

export interface TeacherClassAssignment {
  id: string;
  user_id: string;
  school_id: string;
  session_class_section_id: number;
  subject_id: number | null;
  is_class_teacher: boolean;
  created_at: string;
}

export interface TeacherClassAssignmentWithDetails extends TeacherClassAssignment {
  teacher: UserProfile;
  session_class_section: SessionClassSection;
  subject?: Subject;
}

// ============================================================================
// PARENT-STUDENT RELATIONSHIP TYPES
// ============================================================================

export interface ParentStudentRelationship {
  id: string;
  parent_id: string;
  student_id: number;
  school_id: string;
  relationship: string | null; // 'father', 'mother', 'guardian', etc.
  created_at: string;
}

export interface ParentStudentRelationshipWithDetails extends ParentStudentRelationship {
  parent: UserProfile;
  student: Student;
}

// ============================================================================
// AUTHORIZATION CONTEXT
// ============================================================================

/**
 * Authorization context passed to permission checking functions
 */
export interface AuthorizationContext {
  user: AuthUser | null;
  isAuthenticated: boolean;
  userSchoolId: string | null;
}

// ============================================================================
// PERMISSION CHECK TYPES
// ============================================================================

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}

export interface PermissionCheckOptions {
  resource: Resource;
  action: Action;
  schoolId?: string;
  targetUserId?: string;
  targetStudentId?: number;
}

// ============================================================================
// ROLE-SPECIFIC DATA TYPES
// ============================================================================

export interface SuperAdminDashboardData {
  totalSchools: number;
  totalUsers: number;
  totalStudents: number;
  systemHealth: {
    uptime: string;
    lastBackup: string;
    databaseSize: string;
  };
}

export interface SchoolAdminDashboardData {
  schoolId: string;
  schoolName: string;
  totalStudents: number;
  totalStaff: number;
  totalClassRooms: number;
  activeSession: Session | null;
  feeCollection: {
    totalDue: number;
    totalCollected: number;
    percentageCollected: number;
  };
  pendingApprovals: number;
}

export interface TeacherDashboardData {
  assignedClasses: SessionClassSection[];
  assignedSubjects: Subject[];
  studentCount: number;
  upcomingExams: Exam[];
  assignmentsCreated: number;
}

export interface ClassTeacherDashboardData extends TeacherDashboardData {
  classPerformance: {
    averageMarks: number;
    passPercentage: number;
  };
  classAttendance: {
    averageAttendance: number;
    presentStudents: number;
    absentStudents: number;
  };
}

export interface StudentDashboardData {
  studentId: number;
  studentName: string;
  currentClass: SessionClassSection | null;
  feeStatus: {
    totalDue: number;
    totalPaid: number;
    percentagePaid: number;
  };
  recentMarks: ExamMark[];
  attendance: {
    totalDays: number;
    presentDays: number;
    percentage: number;
  };
}

export interface ParentDashboardData {
  wards: Array<{
    studentId: number;
    studentName: string;
    currentClass: SessionClassSection | null;
    feeStatus: StudentFeeStatus;
    recentMarks: ExamMark[];
    attendance: AttendanceRecord;
  }>;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  school_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface PermissionCache {
  userPermissions: Map<string, CacheEntry<Permission[]>>;
  userRoles: Map<string, CacheEntry<Role[]>>;
  schoolData: Map<string, CacheEntry<School>>;
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  roles: RoleType[];
  school_id?: string; // Optional, required for non-superadmin roles
}

export interface UpdateUserRolesRequest {
  userId: string;
  roles: RoleType[];
  schoolId?: string;
}

export interface AssignTeacherToClassRequest {
  teacherId: string;
  sessionClassSectionId: number;
  subjectId?: number;
  isClassTeacher: boolean;
}

export interface LinkParentToStudentRequest {
  parentId: string;
  studentId: number;
  relationship: string;
}

export interface PermissionCheckRequest {
  resource: Resource;
  action: Action;
  schoolId?: string;
}

// ============================================================================
// DATABASE RECORD TYPES (Extended from existing schema)
// ============================================================================

// These are extended versions of existing types that include RBAC context

export interface StudentWithSchool extends Student {
  school_id: string;
}

export interface SessionWithSchool extends Session {
  school_id: string;
}

export interface ClassWithSchool extends Class {
  school_id: string;
}

export interface SectionWithSchool extends Section {
  school_id: string;
}

export interface SubjectWithSchool extends Subject {
  school_id: string;
}

export interface ExamWithSchool extends Exam {
  school_id: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type RolePermissionMatrix = {
  [key in RoleType]: Resource[];
};

export interface RoleCapabilities {
  canManageSchools: boolean;
  canManageUsers: boolean;
  canManageStudents: boolean;
  canViewFees: boolean;
  canManageFees: boolean;
  canEnterMarks: boolean;
  canViewMarks: boolean;
  canViewReports: boolean;
  canExportData: boolean;
  canViewAuditLogs: boolean;
}

// Imported types (existing schema)
import type {
  Student,
  Session,
  SessionClassSection,
  Class,
  Section,
  Subject,
  Exam,
  ExamMark,
  StudentFeeStatus,
  AttendanceRecord,
} from '@/types/index';