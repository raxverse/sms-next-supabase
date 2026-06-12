-- RBAC Tables Migration
-- Adds role-based access control infrastructure to support multi-tenant school management

-- 1. SCHOOLS TABLE (Multi-tenancy support)
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    principal_name VARCHAR(100),
    website VARCHAR(255),
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ROLES TABLE (Define all possible roles in system)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(500),
    display_name VARCHAR(100),
    is_system_role BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_role_name CHECK (name IN ('superadmin', 'schooladmin', 'teacher', 'classteacher', 'student', 'parent'))
);

-- 3. PERMISSIONS TABLE (Define granular permissions)
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_resource_action UNIQUE (resource, action)
);

-- 4. ROLE_PERMISSIONS JUNCTION TABLE (Map roles to permissions)
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_role_permission UNIQUE (role_id, permission_id)
);

-- 5. USER_ROLES JUNCTION TABLE (Assign roles to users with school context)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_school_role UNIQUE (user_id, school_id, role_id)
);

-- 6. TEACHER_CLASS_ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS teacher_class_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    session_class_section_id INT NOT NULL REFERENCES session_class_sections(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subjects(id) ON DELETE SET NULL,
    is_class_teacher BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_teacher_class UNIQUE (user_id, session_class_section_id, subject_id)
);

-- 7. PARENT_STUDENT_RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS parent_student_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    relationship VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_parent_student UNIQUE (parent_id, student_id)
);

-- 8. ALTER EXISTING TABLES

-- Add columns to user_profiles for RBAC integration
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Add school_id to students table for multi-tenancy
ALTER TABLE students
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

-- Add school_id to existing tables
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE classes
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE sections
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE subjects
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE exams
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE transport_routes
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

ALTER TABLE fee_categories
ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id) ON DELETE CASCADE;

-- 9. CREATE INDEXES FOR PERFORMANCE

-- User role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_school_id ON user_roles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- Permission lookups
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action);

-- Teacher assignments
CREATE INDEX IF NOT EXISTS idx_teacher_class_user_id ON teacher_class_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_class_school_id ON teacher_class_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_class_section_id ON teacher_class_assignments(session_class_section_id);

-- Parent-student relationships
CREATE INDEX IF NOT EXISTS idx_parent_student_parent_id ON parent_student_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student_id ON parent_student_relationships(student_id);

-- School context indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_id ON user_profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_sessions_school_id ON sessions(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_sections_school_id ON sections(school_id);

-- 10. CREATED FUNCTIONS FOR COMMON OPERATIONS

-- Function: Get all permissions for a user by role
CREATE OR REPLACE FUNCTION get_user_permissions(user_uuid UUID)
RETURNS TABLE (resource VARCHAR, action VARCHAR, permission_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT p.resource, p.action, p.id
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    INNER JOIN roles r ON rp.role_id = r.id
    INNER JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid AND ur.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user's school context
CREATE OR REPLACE FUNCTION get_user_school_context(user_uuid UUID)
RETURNS TABLE (school_id UUID, role_name VARCHAR, is_superadmin BOOLEAN) AS $$
BEGIN
    RETURN QUERY
    SELECT ur.school_id, r.name, (r.name = 'superadmin')::BOOLEAN
    FROM user_roles ur
    INNER JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND ur.is_active = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user has specific permission
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, p_resource VARCHAR, p_action VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM permissions p
        INNER JOIN role_permissions rp ON p.id = rp.permission_id
        INNER JOIN roles r ON rp.role_id = r.id
        INNER JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = user_uuid
        AND p.resource = p_resource
        AND p.action = p_action
        AND ur.is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user has any role
CREATE OR REPLACE FUNCTION user_has_role(user_uuid UUID, role_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_roles ur
        INNER JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid AND r.name = role_name AND ur.is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql;

-- Function: Check if user can access school
CREATE OR REPLACE FUNCTION user_can_access_school(user_uuid UUID, school_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Superadmin can access all schools
    IF user_has_role(user_uuid, 'superadmin') THEN
        RETURN TRUE;
    END IF;

    -- Check if user has role in specific school
    RETURN EXISTS (
        SELECT 1
        FROM user_roles ur
        WHERE ur.user_id = user_uuid
        AND (ur.school_id = school_uuid OR ur.school_id IS NULL)
        AND ur.is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql;

-- 11. AUDIT LOGGING TABLE (Track permission changes)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    school_id UUID REFERENCES schools(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
