# Migrations Directory (`src/migrations/`)

## Purpose
Database migration SQL files for setting up the PostgreSQL database schema via Supabase.

## Files

### `001_add_rbac_tables.sql`
**Purpose**: Core RBAC infrastructure
- Creates `schools` table for multi-tenancy
- Creates `roles` table (superadmin, schooladmin, teacher, etc.)
- Creates `permissions` table (resource:action pairs)
- Creates `role_permissions` junction table
- Creates `user_roles` table with school context
- Creates `teacher_class_assignments` table
- Creates `parent_student_relationships` table
- Adds school_id columns to existing tables
- Creates indexes for performance
- Creates helper functions:
  - `get_user_permissions()`: Fetch user permissions
  - `get_user_school_context()`: Get user's school
  - `user_has_permission()`: Permission check
  - `user_has_role()`: Role check
  - `user_can_access_school()`: Multi-tenant check
- Creates `audit_logs` table for tracking changes

### `002_add_rls_policies.sql`
**Purpose**: Row-Level Security policies
- Enables RLS on all tables
- Creates policies for each role:
  - Superadmin: Full access to all data
  - School admin: Access to their school's data
  - Teachers: Access to their assigned classes
  - Students: Access to their own records
  - Parents: Access to their ward's records
- Policies for each table:
  - `schools`: View own school
  - `user_profiles`: View/update own profile
  - `students`: Access based on role
  - `student_enrollments`: Class-based access
  - `student_fee_dues`: Fee record access
  - `fee_payments`: Payment access
  - `exam_marks`: Marks access
  - And many more...

### `003_seed_roles_permissions.sql`
**Purpose**: Initial data seeding
- Inserts 6 role definitions (superadmin to parent)
- Inserts 52 permissions across categories
- Maps permissions to roles:
  - Superadmin: All permissions
  - School admin: School management permissions
  - Teacher: Class and marks permissions
  - Class teacher: Extended teacher permissions
  - Student: Own record access
  - Parent: Ward record access

## Running Migrations
These migrations should be applied via Supabase MCP tools:
```bash
# Via MCP tool
mcp__supabase__apply_migration
```

## Migration Guidelines
1. **Number migrations**: 001_, 002_, etc.
2. **Descriptive names**: `add_rbac_tables`, `seed_roles`
3. **One change per migration**: Keep focused
4. **Include rollback**: Consider how to reverse
5. **Test locally**: Test before deploying
