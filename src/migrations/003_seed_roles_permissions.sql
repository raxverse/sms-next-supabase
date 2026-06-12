-- Seed Roles, Permissions, and Initial Test Data
-- This migration sets up the foundational RBAC data

-- ============================================================================
-- 1. INSERT ROLES
-- ============================================================================

INSERT INTO roles (id, name, description, display_name, is_system_role) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'superadmin', 'System super administrator - full access to all schools and data', 'Super Administrator', TRUE),
    ('550e8400-e29b-41d4-a716-446655440002', 'schooladmin', 'School administrator - manage school-specific data, users, and operations', 'School Administrator', TRUE),
    ('550e8400-e29b-41d4-a716-446655440003', 'teacher', 'Teacher - view assigned classes and manage marks/attendance for their subjects', 'Teacher', TRUE),
    ('550e8400-e29b-41d4-a716-446655440004', 'classteacher', 'Class Teacher - manage class operations, add assignments, view class performance', 'Class Teacher', TRUE),
    ('550e8400-e29b-41d4-a716-446655440005', 'student', 'Student - view own profile, fee status, marks, and records', 'Student', TRUE),
    ('550e8400-e29b-41d4-a716-446655440006', 'parent', 'Parent - view child ward''s profile, fee status, marks, and attendance', 'Parent', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 2. INSERT PERMISSIONS (Resource-based with actions)
-- ============================================================================

INSERT INTO permissions (id, resource, action, description, category) VALUES
-- School Management
    ('550e8400-e29b-41d4-a716-446655450001', 'schools', 'create', 'Create new school', 'school_management'),
    ('550e8400-e29b-41d4-a716-446655450002', 'schools', 'read', 'View school details', 'school_management'),
    ('550e8400-e29b-41d4-a716-446655450003', 'schools', 'update', 'Update school information', 'school_management'),
    ('550e8400-e29b-41d4-a716-446655450004', 'schools', 'delete', 'Delete school', 'school_management'),
    ('550e8400-e29b-41d4-a716-446655450005', 'schools', 'list', 'List all schools', 'school_management'),

-- User Management
    ('550e8400-e29b-41d4-a716-446655450006', 'users', 'create', 'Create new user', 'user_management'),
    ('550e8400-e29b-41d4-a716-446655450007', 'users', 'read', 'View user details', 'user_management'),
    ('550e8400-e29b-41d4-a716-446655450008', 'users', 'update', 'Update user information', 'user_management'),
    ('550e8400-e29b-41d4-a716-446655450009', 'users', 'delete', 'Delete user account', 'user_management'),
    ('550e8400-e29b-41d4-a716-446655450010', 'users', 'list', 'List users', 'user_management'),
    ('550e8400-e29b-41d4-a716-446655450011', 'user_roles', 'assign', 'Assign roles to users', 'user_management'),
    ('550e8400-e29b-41d4-a716-446655450012', 'user_roles', 'revoke', 'Revoke roles from users', 'user_management'),

-- Student Management
    ('550e8400-e29b-41d4-a716-446655450013', 'students', 'create', 'Create new student record', 'student_management'),
    ('550e8400-e29b-41d4-a716-446655450014', 'students', 'read', 'View student details', 'student_management'),
    ('550e8400-e29b-41d4-a716-446655450015', 'students', 'update', 'Update student information', 'student_management'),
    ('550e8400-e29b-41d4-a716-446655450016', 'students', 'delete', 'Delete student record', 'student_management'),
    ('550e8400-e29b-41d4-a716-446655450017', 'students', 'list', 'List students', 'student_management'),
    ('550e8400-e29b-41d4-a716-446655450018', 'students', 'enroll', 'Enroll student in class/session', 'student_management'),

-- Fee Management
    ('550e8400-e29b-41d4-a716-446655450019', 'fee_records', 'read', 'View fee records and dues', 'fee_management'),
    ('550e8400-e29b-41d4-a716-446655450020', 'fee_records', 'create', 'Create fee structure and dues', 'fee_management'),
    ('550e8400-e29b-41d4-a716-446655450021', 'fee_records', 'update', 'Update fee dues and records', 'fee_management'),
    ('550e8400-e29b-41d4-a716-446655450022', 'fee_records', 'delete', 'Delete fee records', 'fee_management'),
    ('550e8400-e29b-41d4-a716-446655450023', 'fee_payments', 'create', 'Record fee payment', 'fee_management'),
    ('550e8400-e29b-41d4-a716-446655450024', 'fee_payments', 'read', 'View fee payment records', 'fee_management'),
    ('550e8400-e29b-41d4-a716-446655450025', 'fee_payments', 'update', 'Update payment records', 'fee_management'),

-- Exam Management
    ('550e8400-e29b-41d4-a716-446655450026', 'exams', 'create', 'Create exam and schedules', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450027', 'exams', 'read', 'View exam details', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450028', 'exams', 'update', 'Update exam information', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450029', 'exams', 'delete', 'Delete exam', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450030', 'exam_marks', 'create', 'Enter exam marks', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450031', 'exam_marks', 'read', 'View exam marks', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450032', 'exam_marks', 'update', 'Update exam marks', 'exam_management'),
    ('550e8400-e29b-41d4-a716-446655450033', 'results', 'read', 'View exam results', 'exam_management'),

-- Class Management
    ('550e8400-e29b-41d4-a716-446655450034', 'classes', 'create', 'Create class', 'class_management'),
    ('550e8400-e29b-41d4-a716-446655450035', 'classes', 'read', 'View class details', 'class_management'),
    ('550e8400-e29b-41d4-a716-446655450036', 'classes', 'update', 'Update class information', 'class_management'),
    ('550e8400-e29b-41d4-a716-446655450037', 'classes', 'delete', 'Delete class', 'class_management'),
    ('550e8400-e29b-41d4-a716-446655450038', 'class_assignments', 'create', 'Assign teachers to classes', 'class_management'),
    ('550e8400-e29b-41d4-a716-446655450039', 'class_assignments', 'read', 'View class assignments', 'class_management'),
    ('550e8400-e29b-41d4-a716-446655450040', 'class_assignments', 'update', 'Update class assignments', 'class_management'),

-- Academic Content
    ('550e8400-e29b-41d4-a716-446655450041', 'assignments', 'create', 'Create assignments/work', 'academic_content'),
    ('550e8400-e29b-41d4-a716-446655450042', 'assignments', 'read', 'View assignments', 'academic_content'),
    ('550e8400-e29b-41d4-a716-446655450043', 'quizzes', 'create', 'Create quizzes', 'academic_content'),
    ('550e8400-e29b-41d4-a716-446655450044', 'quizzes', 'read', 'View quizzes', 'academic_content'),
    ('550e8400-e29b-41d4-a716-446655450045', 'question_papers', 'create', 'Create question papers', 'academic_content'),
    ('550e8400-e29b-41d4-a716-446655450046', 'question_papers', 'read', 'View question papers', 'academic_content'),

-- Reports & Analytics
    ('550e8400-e29b-41d4-a716-446655450047', 'reports', 'read', 'View reports and analytics', 'reports'),
    ('550e8400-e29b-41d4-a716-446655450048', 'reports', 'export', 'Export reports', 'reports'),
    ('550e8400-e29b-41d4-a716-446655450049', 'attendance', 'read', 'View attendance records', 'reports'),

-- Settings
    ('550e8400-e29b-41d4-a716-446655450050', 'settings', 'read', 'View settings', 'system_settings'),
    ('550e8400-e29b-41d4-a716-446655450051', 'settings', 'update', 'Update settings', 'system_settings'),
    ('550e8400-e29b-41d4-a716-446655450052', 'audit_logs', 'read', 'View audit logs', 'system_settings')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. MAP ROLES TO PERMISSIONS
-- ============================================================================

-- SUPERADMIN: Full access to all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'superadmin'::uuid, id FROM permissions
ON CONFLICT DO NOTHING;

-- SCHOOLADMIN: School-level administrative permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450002'), -- schools:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450003'), -- schools:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450006'), -- users:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450007'), -- users:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450008'), -- users:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450010'), -- users:list
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440011'), -- user_roles:assign
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450013'), -- students:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450014'), -- students:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450015'), -- students:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450017'), -- students:list
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450018'), -- students:enroll
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450019'), -- fee_records:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450020'), -- fee_records:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450021'), -- fee_records:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450023'), -- fee_payments:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450024'), -- fee_payments:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450025'), -- fee_payments:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450026'), -- exams:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450027'), -- exams:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450028'), -- exams:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450034'), -- classes:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450035'), -- classes:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450036'), -- classes:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450038'), -- class_assignments:create
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450040'), -- class_assignments:update
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450047'), -- reports:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450048'), -- reports:export
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450049'), -- attendance:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450050'), -- settings:read
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655450051') -- settings:update
ON CONFLICT DO NOTHING;

-- TEACHER: Limited classroom management
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450014'), -- students:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450030'), -- exam_marks:create
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450031'), -- exam_marks:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450032'), -- exam_marks:update
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450035'), -- classes:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450039'), -- class_assignments:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450041'), -- assignments:create
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450042'), -- assignments:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450043'), -- quizzes:create
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450044'), -- quizzes:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450045'), -- question_papers:create
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450046'), -- question_papers:read
    ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655450049') -- attendance:read
ON CONFLICT DO NOTHING;

-- CLASSTEACHER: Class-specific management + teacher permissions
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450014'), -- students:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450030'), -- exam_marks:create
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440031'), -- exam_marks:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450032'), -- exam_marks:update
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450035'), -- classes:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450039'), -- class_assignments:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450041'), -- assignments:create
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450042'), -- assignments:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450043'), -- quizzes:create
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450044'), -- quizzes:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450045'), -- question_papers:create
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450046'), -- question_papers:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450049'), -- attendance:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450019'), -- fee_records:read
    ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655450024') -- fee_payments:read
ON CONFLICT DO NOTHING;

-- STUDENT: View own records
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655450014'), -- students:read (own)
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655450019'), -- fee_records:read (own)
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655450024'), -- fee_payments:read (own)
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655450031'), -- exam_marks:read (own)
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655450033'), -- results:read (own)
    ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655450049') -- attendance:read (own)
ON CONFLICT DO NOTHING;

-- PARENT: View ward's records
INSERT INTO role_permissions (role_id, permission_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655450014'), -- students:read (ward)
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655450019'), -- fee_records:read (ward)
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655450024'), -- fee_payments:read (ward)
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655450031'), -- exam_marks:read (ward)
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655450033'), -- results:read (ward)
    ('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655450049') -- attendance:read (ward)
ON CONFLICT DO NOTHING;
