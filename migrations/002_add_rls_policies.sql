-- Row-Level Security (RLS) Policies for Multi-Tenant Security
-- Enforces data access control at database level based on user roles

-- Enable RLS on all relevant tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_fee_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payment_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_class_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. SCHOOLS TABLE RLS POLICIES
-- ============================================================================

-- Superadmin can view all schools
CREATE POLICY "superadmin_view_all_schools" ON schools
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'superadmin')
    );

-- School admins can view their school
CREATE POLICY "schooladmin_view_own_school" ON schools
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            INNER JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND ur.school_id = schools.id
            AND r.name = 'schooladmin'
            AND ur.is_active = TRUE
        )
    );

-- Other authenticated users can view schools they belong to
CREATE POLICY "users_view_school_self_context" ON schools
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.school_id = schools.id
            AND ur.is_active = TRUE
        )
    );

-- ============================================================================
-- 2. USER_PROFILES TABLE RLS POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "users_view_own_profile" ON user_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- School admins can view profiles in their school
CREATE POLICY "schooladmin_view_school_profiles" ON user_profiles
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.school_id = user_profiles.school_id
            AND ur.is_active = TRUE
        )
    );

-- Superadmin can view all profiles
CREATE POLICY "superadmin_view_all_profiles" ON user_profiles
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- School admins can update profiles in their school
CREATE POLICY "schooladmin_update_school_profiles" ON user_profiles
    FOR UPDATE
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM user_roles ur
            WHERE ur.user_id = auth.uid()
            AND ur.school_id = user_profiles.school_id
            AND ur.is_active = TRUE
        )
    );

-- ============================================================================
-- 3. STUDENTS TABLE RLS POLICIES
-- ============================================================================

-- Superadmin can view all students
CREATE POLICY "superadmin_view_all_students" ON students
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- School admins can view students in their school
CREATE POLICY "schooladmin_view_school_students" ON students
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        students.school_id = (
            SELECT school_id FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
        )
    );

-- Teachers can view students in their assigned classes
CREATE POLICY "teacher_view_assigned_students" ON students
    FOR SELECT
    USING (
        (user_has_role(auth.uid(), 'teacher') OR user_has_role(auth.uid(), 'classteacher')) AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN session_class_sections scs ON se.session_class_section_id = scs.id
            INNER JOIN teacher_class_assignments tca ON tca.session_class_section_id = scs.id
            WHERE se.student_id = students.id
            AND tca.user_id = auth.uid()
        )
    );

-- Students can view their own profile
CREATE POLICY "students_view_own_profile" ON students
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'student') AND
        EXISTS (
            SELECT 1 FROM parent_student_relationships psr
            INNER JOIN user_profiles up ON psr.parent_id = up.id
            WHERE psr.student_id = students.id
            AND (
                up.id = auth.uid() -- Student viewing themselves
                OR EXISTS (
                    SELECT 1 FROM parent_student_relationships psr2
                    WHERE psr2.student_id = students.id
                    AND psr2.parent_id = auth.uid()
                ) -- Parent viewing their ward
            )
        )
    );

-- Simplified student view for own record
CREATE POLICY "student_view_self_as_student" ON students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
        ) AND
        user_has_role(auth.uid(), 'student') AND
        id IN (
            SELECT CAST(auth.uid()::TEXT AS INT)::INT
        )
    );

-- Parents can view their ward's profile
CREATE POLICY "parent_view_ward_profile" ON students
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'parent') AND
        EXISTS (
            SELECT 1 FROM parent_student_relationships psr
            WHERE psr.student_id = students.id
            AND psr.parent_id = auth.uid()
        )
    );

-- School admins can update students in their school
CREATE POLICY "schooladmin_update_school_students" ON students
    FOR UPDATE
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        students.school_id = (
            SELECT school_id FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
        )
    );

-- ============================================================================
-- 4. STUDENT_ENROLLMENTS TABLE RLS POLICIES
-- ============================================================================

-- Superadmin can view all enrollments
CREATE POLICY "superadmin_view_all_enrollments" ON student_enrollments
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- School admins can view enrollments in their school
CREATE POLICY "schooladmin_view_school_enrollments" ON student_enrollments
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM sessions s
            WHERE s.id = student_enrollments.session_id
            AND s.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

-- Teachers can view enrollments for their classes
CREATE POLICY "teacher_view_class_enrollments" ON student_enrollments
    FOR SELECT
    USING (
        (user_has_role(auth.uid(), 'teacher') OR user_has_role(auth.uid(), 'classteacher')) AND
        EXISTS (
            SELECT 1 FROM session_class_sections scs
            INNER JOIN teacher_class_assignments tca ON tca.session_class_section_id = scs.id
            WHERE scs.id = student_enrollments.session_class_section_id
            AND tca.user_id = auth.uid()
        )
    );

-- Students can view their own enrollment
CREATE POLICY "student_view_own_enrollment" ON student_enrollments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM students s
            WHERE s.id = student_enrollments.student_id
            AND s.id = CAST(auth.uid()::TEXT AS INT)
        )
    );

-- Parents can view ward's enrollments
CREATE POLICY "parent_view_ward_enrollment" ON student_enrollments
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'parent') AND
        EXISTS (
            SELECT 1 FROM parent_student_relationships psr
            WHERE psr.student_id = student_enrollments.student_id
            AND psr.parent_id = auth.uid()
        )
    );

-- ============================================================================
-- 5. STUDENT_FEE_DUES TABLE RLS POLICIES
-- ============================================================================

-- Superadmin can view all fees
CREATE POLICY "superadmin_view_all_fees" ON student_fee_dues
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- School admins can view fees for their school
CREATE POLICY "schooladmin_view_school_fees" ON student_fee_dues
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN sessions s ON se.session_id = s.id
            WHERE se.id = student_fee_dues.enrollment_id
            AND s.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

-- Students can view their own fees
CREATE POLICY "student_view_own_fees" ON student_fee_dues
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN students s ON se.student_id = s.id
            WHERE se.id = student_fee_dues.enrollment_id
            AND s.id = CAST(auth.uid()::TEXT AS INT)
        )
    );

-- Parents can view ward's fees
CREATE POLICY "parent_view_ward_fees" ON student_fee_dues
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'parent') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN parent_student_relationships psr ON se.student_id = psr.student_id
            WHERE se.id = student_fee_dues.enrollment_id
            AND psr.parent_id = auth.uid()
        )
    );

-- School admins can update fees
CREATE POLICY "schooladmin_update_school_fees" ON student_fee_dues
    FOR UPDATE
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN sessions s ON se.session_id = s.id
            WHERE se.id = student_fee_dues.enrollment_id
            AND s.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

-- ============================================================================
-- 6. FEE_PAYMENTS TABLE RLS POLICIES
-- ============================================================================

-- Superadmin can view all payments
CREATE POLICY "superadmin_view_all_payments" ON fee_payments
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- School admins can view payments in their school
CREATE POLICY "schooladmin_view_school_payments" ON fee_payments
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN sessions s ON se.session_id = s.id
            WHERE se.id = fee_payments.enrollment_id
            AND s.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

-- Students can view their own payments
CREATE POLICY "student_view_own_payments" ON fee_payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN students s ON se.student_id = s.id
            WHERE se.id = fee_payments.enrollment_id
            AND s.id = CAST(auth.uid()::TEXT AS INT)
        )
    );

-- Parents can view ward's payments
CREATE POLICY "parent_view_ward_payments" ON fee_payments
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'parent') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN parent_student_relationships psr ON se.student_id = psr.student_id
            WHERE se.id = fee_payments.enrollment_id
            AND psr.parent_id = auth.uid()
        )
    );

-- School admins can create payments
CREATE POLICY "schooladmin_create_payments" ON fee_payments
    FOR INSERT
    WITH CHECK (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN sessions s ON se.session_id = s.id
            WHERE se.id = enrollment_id
            AND s.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

-- ============================================================================
-- 7. EXAM_MARKS TABLE RLS POLICIES
-- ============================================================================

-- Superadmin can view all marks
CREATE POLICY "superadmin_view_all_marks" ON exam_marks
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- School admins can view marks in their school
CREATE POLICY "schooladmin_view_school_marks" ON exam_marks
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM exam_schedules es
            INNER JOIN exams e ON es.exam_id = e.id
            WHERE es.id = exam_marks.exam_schedule_id
            AND e.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

-- Teachers can view/update marks for their assigned classes
CREATE POLICY "teacher_view_assigned_marks" ON exam_marks
    FOR SELECT
    USING (
        (user_has_role(auth.uid(), 'teacher') OR user_has_role(auth.uid(), 'classteacher')) AND
        EXISTS (
            SELECT 1 FROM exam_schedules es
            INNER JOIN student_enrollments se ON se.session_class_section_id IS NOT NULL
            INNER JOIN teacher_class_assignments tca ON tca.session_class_section_id = se.session_class_section_id
            WHERE es.id = exam_marks.exam_schedule_id
            AND se.enrollment_id = exam_marks.enrollment_id
            AND tca.user_id = auth.uid()
        )
    );

-- Students can view their own marks
CREATE POLICY "student_view_own_marks" ON exam_marks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN students s ON se.student_id = s.id
            WHERE se.id = exam_marks.enrollment_id
            AND s.id = CAST(auth.uid()::TEXT AS INT)
        )
    );

-- Parents can view ward's marks
CREATE POLICY "parent_view_ward_marks" ON exam_marks
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'parent') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN parent_student_relationships psr ON se.student_id = psr.student_id
            WHERE se.id = exam_marks.enrollment_id
            AND psr.parent_id = auth.uid()
        )
    );

-- Teachers can insert marks
CREATE POLICY "teacher_insert_marks" ON exam_marks
    FOR INSERT
    WITH CHECK (
        (user_has_role(auth.uid(), 'teacher') OR user_has_role(auth.uid(), 'classteacher')) AND
        EXISTS (
            SELECT 1 FROM exam_schedules es
            INNER JOIN student_enrollments se ON se.session_class_section_id IS NOT NULL
            INNER JOIN teacher_class_assignments tca ON tca.session_class_section_id = se.session_class_section_id
            WHERE es.id = exam_schedule_id
            AND tca.user_id = auth.uid()
        )
    );

-- Teachers can update marks
CREATE POLICY "teacher_update_marks" ON exam_marks
    FOR UPDATE
    USING (
        (user_has_role(auth.uid(), 'teacher') OR user_has_role(auth.uid(), 'classteacher')) AND
        EXISTS (
            SELECT 1 FROM exam_schedules es
            INNER JOIN student_enrollments se ON se.session_class_section_id IS NOT NULL
            INNER JOIN teacher_class_assignments tca ON tca.session_class_section_id = se.session_class_section_id
            WHERE es.id = exam_marks.exam_schedule_id
            AND se.id = exam_marks.enrollment_id
            AND tca.user_id = auth.uid()
        )
    );

-- ============================================================================
-- 8. STUDENT_RESULTS TABLE RLS POLICIES
-- ============================================================================

-- Similar to exam_marks for results
CREATE POLICY "superadmin_view_all_results" ON student_results
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

CREATE POLICY "schooladmin_view_school_results" ON student_results
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM exams e
            INNER JOIN student_enrollments se ON e.id = student_results.exam_id
            WHERE e.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

CREATE POLICY "student_view_own_results" ON student_results
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN students s ON se.student_id = s.id
            WHERE se.id = student_results.enrollment_id
            AND s.id = CAST(auth.uid()::TEXT AS INT)
        )
    );

CREATE POLICY "parent_view_ward_results" ON student_results
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'parent') AND
        EXISTS (
            SELECT 1 FROM student_enrollments se
            INNER JOIN parent_student_relationships psr ON se.student_id = psr.student_id
            WHERE se.id = student_results.enrollment_id
            AND psr.parent_id = auth.uid()
        )
    );

-- ============================================================================
-- 9. EXAM_SCHEDULES TABLE RLS POLICIES
-- ============================================================================

CREATE POLICY "superadmin_view_all_schedules" ON exam_schedules
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

CREATE POLICY "schooladmin_view_school_schedules" ON exam_schedules
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        EXISTS (
            SELECT 1 FROM exams e
            WHERE e.id = exam_schedules.exam_id
            AND e.school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
        )
    );

CREATE POLICY "teacher_view_assigned_schedules" ON exam_schedules
    FOR SELECT
    USING (
        (user_has_role(auth.uid(), 'teacher') OR user_has_role(auth.uid(), 'classteacher')) AND
        EXISTS (
            SELECT 1 FROM teacher_class_assignments tca
            WHERE tca.session_class_section_id IN (
                SELECT id FROM session_class_sections
                WHERE class_id = exam_schedules.class_id
            )
            AND tca.user_id = auth.uid()
        )
    );

-- ============================================================================
-- 10. TEACHER_CLASS_ASSIGNMENTS TABLE RLS POLICIES
-- ============================================================================

CREATE POLICY "superadmin_view_all_assignments" ON teacher_class_assignments
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

CREATE POLICY "schooladmin_view_school_assignments" ON teacher_class_assignments
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        teacher_class_assignments.school_id = (
            SELECT school_id FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
        )
    );

CREATE POLICY "teacher_view_own_assignments" ON teacher_class_assignments
    FOR SELECT
    USING (user_id = auth.uid());

-- School admins can manage assignments
CREATE POLICY "schooladmin_manage_assignments" ON teacher_class_assignments
    FOR INSERT
    WITH CHECK (
        user_has_role(auth.uid(), 'schooladmin') AND
        school_id = (
            SELECT school_id FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
        )
    );

-- ============================================================================
-- 11. PARENT_STUDENT_RELATIONSHIPS TABLE RLS POLICIES
-- ============================================================================

CREATE POLICY "parent_view_own_relationships" ON parent_student_relationships
    FOR SELECT
    USING (parent_id = auth.uid());

CREATE POLICY "schooladmin_view_school_relationships" ON parent_student_relationships
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        school_id = (
            SELECT school_id FROM user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
        )
    );

CREATE POLICY "superadmin_view_all_relationships" ON parent_student_relationships
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));

-- ============================================================================
-- 12. USER_ROLES TABLE RLS POLICIES
-- ============================================================================

-- Users can view their own roles
CREATE POLICY "users_view_own_roles" ON user_roles
    FOR SELECT
    USING (user_id = auth.uid());

-- School admins can view roles in their school
CREATE POLICY "schooladmin_view_school_roles" ON user_roles
    FOR SELECT
    USING (
        user_has_role(auth.uid(), 'schooladmin') AND
        (
            school_id = (
                SELECT school_id FROM user_roles ur
                WHERE ur.user_id = auth.uid() AND ur.is_active = TRUE LIMIT 1
            )
            OR user_id = auth.uid()
        )
    );

-- Superadmin can view all roles
CREATE POLICY "superadmin_view_all_roles" ON user_roles
    FOR SELECT
    USING (user_has_role(auth.uid(), 'superadmin'));
