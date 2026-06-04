# School Management System - RBAC Implementation Guide

## Overview

This document provides a complete guide to implementing and using the Role-Based Access Control (RBAC) system in the School Management System (SMS).

## Table of Contents

1. [Architecture](#architecture)
2. [Database Setup](#database-setup)
3. [Authentication & Authorization](#authentication--authorization)
4. [Using the RBAC System](#using-the-rbac-system)
5. [API Protection Patterns](#api-protection-patterns)
6. [Frontend Components](#frontend-components)
7. [Common Scenarios](#common-scenarios)
8. [Troubleshooting](#troubleshooting)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AuthProvider (useAuth hook)                      │  │
│  │ - Manages auth state                            │  │
│  │ - Provides role/permission checks               │  │
│  │ - Handles token refresh                         │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ API Protection Layer (apiProtection.ts)         │  │
│  │ - requireAuth()                                 │  │
│  │ - requireRole()                                 │  │
│  │ - requirePermission()                           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│           Authorization Services                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AuthorizationService                            │  │
│  │ - hasRole(), hasPermission()                    │  │
│  │ - canAccessSchool(), canAccessStudent()        │  │
│  │ - buildAuthUser()                              │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ AuthService                                     │  │
│  │ - createUserWithRole()                          │  │
│  │ - updateUserRoles()                             │  │
│  │ - assignTeacherToClass()                        │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ PermissionCache                                 │  │
│  │ - In-memory TTL cache                           │  │
│  │ - Reduces DB queries                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Supabase Database                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ RBAC Tables                                     │  │
│  │ - schools, roles, permissions                   │  │
│  │ - user_roles, role_permissions                  │  │
│  │ - teacher_class_assignments                     │  │
│  │ - parent_student_relationships                  │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Row-Level Security (RLS)                        │  │
│  │ - Enforces data access at DB level              │  │
│  │ - Prevents unauthorized queries                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Login
    ↓
Supabase Auth.signIn()
    ↓
Session established, get user ID
    ↓
AuthService.getUserWithContext(userId)
    ↓
Fetch user profile + roles + permissions
    ↓
AuthorizationService.buildAuthUser()
    ↓
Return AuthUser with full RBAC context
    ↓
useAuth() hook provides role/permission checks
    ↓
Components render conditionally based on permissions
```

---

## Database Setup

### 1. Apply Migrations

Run these SQL migrations in Supabase SQL Editor in order:

```bash
# 1. Create RBAC tables and indexes
migrations/001_add_rbac_tables.sql

# 2. Enable RLS and create policies
migrations/002_add_rls_policies.sql

# 3. Seed roles and permissions
migrations/003_seed_roles_permissions.sql
```

### 2. Verify Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'schools' OR table_name LIKE 'roles' OR table_name LIKE '%user_roles%';
```

### 3. Verify RLS Enabled

```sql
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'exams', 'student_fee_dues');

-- Should show all with rls_enabled = on
```

---

## Authentication & Authorization

### 1. AuthProvider Setup

The `AuthProvider` is already configured in `app/layout.tsx`. It wraps the entire app and provides the `useAuth()` hook.

```tsx
// app/layout.tsx
import { AuthProvider } from '@/app/providers/AuthProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Access Auth Context

Use the `useAuth()` hook in any client component:

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function MyComponent() {
  const { 
    user,                    // Supabase auth user
    profile,                 // User profile data
    authUser,                // AuthUser with RBAC context
    isAuthenticated,         // Boolean
    isLoading,               // Loading state
    hasRole,                 // Function: hasRole(role)
    hasPermission,           // Function: hasPermission(resource, action)
    hasAnyRole,              // Function: hasAnyRole(roles[])
    hasAllPermissions,       // Function: hasAllPermissions(permissions[])
    canAccessSchool,         // Function: canAccessSchool(schoolId)
  } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {profile?.first_name}</h1>
      <p>Role: {authUser?.roles.join(', ')}</p>
    </div>
  )
}
```

### 3. Role Types

Six roles are available in the system:

| Role | Description | Capabilities |
|------|-------------|--------------|
| **superadmin** | System administrator | Full access to all schools and data |
| **schooladmin** | School administrator | Manage school-specific users, students, fees |
| **teacher** | Classroom teacher | View assigned classes, enter marks, create assignments |
| **classteacher** | Class coordinator | Manage class, view performance, manage students |
| **student** | Student | View own profile, marks, fees, attendance |
| **parent** | Parent/guardian | View ward's profile, marks, fees, attendance |

### 4. Permissions Model

Permissions follow a resource:action model:

```
Format: "{resource}:{action}"
Examples:
- "students:read"
- "students:create"
- "fee_records:update"
- "exam_marks:enter"
- "exams:delete"
```

Available resources:
- schools, users, students, fee_records, fee_payments
- exams, exam_marks, results, classes, class_assignments
- assignments, quizzes, question_papers, reports, attendance
- settings, audit_logs, user_roles

Available actions:
- create, read, update, delete, list, assign, revoke, enroll, export

---

## Using the RBAC System

### Check User Roles

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function AdminPanel() {
  const { hasRole, hasAnyRole, hasAllRoles } = useAuth()

  // Check single role
  if (!hasRole('schooladmin')) {
    return <div>Access denied</div>
  }

  // Check if user has any of several roles
  if (!hasAnyRole(['superadmin', 'schooladmin'])) {
    return <div>Admin access required</div>
  }

  // Check if user has all roles (rare)
  if (!hasAllRoles(['teacher', 'classteacher'])) {
    return <div>Special access required</div>
  }

  return <div>Admin Panel</div>
}
```

### Check User Permissions

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function StudentManagement() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth()

  // Check single permission
  if (!hasPermission('students', 'create')) {
    return <div>Cannot create students</div>
  }

  // Check if user has any permission
  if (!hasAnyPermission(['students:read', 'students:create'])) {
    return <div>No student access</div>
  }

  // Check if user has all permissions
  if (!hasAllPermissions(['students:read', 'students:update'])) {
    return <div>Insufficient permissions</div>
  }

  return <div>Student Management</div>
}
```

### Check School Access

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function SchoolSpecificView({ schoolId }) {
  const { canAccessSchool } = useAuth()

  if (!canAccessSchool(schoolId)) {
    return <div>Cannot access this school</div>
  }

  return <div>School Details</div>
}
```

### Get User Context

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function UserInfo() {
  const { authUser } = useAuth()

  return (
    <div>
      <p>Name: {authUser?.first_name} {authUser?.last_name}</p>
      <p>Email: {authUser?.email}</p>
      <p>School: {authUser?.school?.name}</p>
      <p>Roles: {authUser?.roles.join(', ')}</p>
      <p>Permissions: {authUser?.permissions.length}</p>
    </div>
  )
}
```

---

## API Protection Patterns

### Basic API Route Protection

```typescript
// app/api/students/route.ts

import { requireAdmin, success } from '@/lib/apiProtection'
import { NextRequest } from 'next/server'

export const GET = async (request: NextRequest) => {
  try {
    // Requires user to be admin
    const user = await requireAdmin(request)

    // User is authenticated and has admin role
    // Your logic here...

    return success({ students: [] })
  } catch (error) {
    // Error handling (401, 403, etc.)
    return error as any
  }
}
```

### Role-Specific Route

```typescript
// app/api/admin/users/route.ts

import { requireRole, success, forbidden } from '@/lib/apiProtection'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const user = await requireRole(request, 'superadmin')

    // Only superadmin can reach here
    // Your logic...

    return success({ message: 'User created' })
  } catch (error) {
    return error as any
  }
}
```

### Permission-Specific Route

```typescript
// app/api/marks/route.ts

import { requirePermission, success } from '@/lib/apiProtection'
import { NextRequest } from 'next/server'

export const POST = async (request: NextRequest) => {
  try {
    const user = await requirePermission(request, 'exam_marks', 'create')

    // User must have permission to create exam marks
    // Your logic...

    return success({ message: 'Marks entered' })
  } catch (error) {
    return error as any
  }
}
```

### Using Helper Wrappers

```typescript
// Option 1: apiRouteAdminOnly wrapper
import { apiRouteAdminOnly, success } from '@/lib/apiProtection'

export const GET = apiRouteAdminOnly(async (request, user) => {
  // user is authenticated admin, fully typed
  return success({ data: [] })
})

// Option 2: apiRouteWithRole wrapper
import { apiRouteWithRole, success } from '@/lib/apiProtection'

export const GET = apiRouteWithRole('teacher', async (request, user) => {
  // user is authenticated teacher
  return success({ data: [] })
})

// Option 3: apiRouteWithPermission wrapper
import { apiRouteWithPermission, success } from '@/lib/apiProtection'

export const GET = apiRouteWithPermission('exams', 'read', async (request, user) => {
  // user has permission to read exams
  return success({ data: [] })
})
```

### Get School Context

```typescript
// Get school from request or user's school

import { getSchoolContext, forbidden } from '@/lib/apiProtection'

export const GET = async (request: NextRequest) => {
  try {
    const schoolId = await getSchoolContext(request)

    if (!schoolId) {
      return forbidden('School context required')
    }

    // Now fetch data for this school
    // Your logic...
  } catch (error) {
    return error as any
  }
}
```

---

## Frontend Components

### Permission Guard Component

```tsx
'use client'

import { PermissionGuard } from '@/app/components/auth/PermissionGuard'

// Only show delete button if user can delete students
<PermissionGuard resource="students" action="delete" fallback={<span>No permission</span>}>
  <button onClick={handleDelete}>Delete Student</button>
</PermissionGuard>
```

### Role Guard Component

```tsx
'use client'

import { RoleGuard, AdminGuard, SuperAdminGuard } from '@/app/components/auth/PermissionGuard'

// Show admin panel only to admins
<AdminGuard>
  <AdminPanel />
</AdminGuard>

// Show settings only to superadmin
<SuperAdminGuard>
  <SystemSettings />
</SuperAdminGuard>

// Show to specific roles
<RoleGuard roles={['teacher', 'classteacher']}>
  <TeacherContent />
</RoleGuard>
```

### Protected Button

```tsx
'use client'

import { ProtectedButton } from '@/app/components/auth/PermissionGuard'

// Disabled if no permission
<ProtectedButton
  resource="students"
  action="delete"
  onClick={handleDelete}
  fallbackText="No permission"
>
  Delete
</ProtectedButton>
```

### Conditional Rendering

```tsx
'use client'

import { ConditionalRender, AuthLoading, RequireAuth } from '@/app/components/auth/PermissionGuard'
import { useAuth } from '@/app/providers/AuthProvider'

export function Dashboard() {
  const { authUser, isLoading } = useAuth()

  return (
    <AuthLoading loadingComponent={<LoadingSpinner />}>
      <RequireAuth fallback={<LoginPrompt />}>
        <ConditionalRender
          condition={authUser?.isSuperAdmin}
          children={<SuperAdminDashboard />}
          fallback={<RegularUserDashboard />}
        />
      </RequireAuth>
    </AuthLoading>
  )
}
```

---

## Common Scenarios

### Scenario 1: Create User with Role

```typescript
// lib/authService.ts

import { AuthService } from '@/lib/authService'

const { user, error } = await AuthService.createUserWithRole(
  'teacher@school.com',
  'SecurePassword123',
  'John',
  'Doe',
  ['teacher'],
  schoolId // Optional for superadmin
)

if (error) {
  console.error('Failed to create user:', error)
} else {
  console.log('User created:', user.id)
}
```

### Scenario 2: Assign Teacher to Class

```typescript
// lib/authService.ts

import { AuthService } from '@/lib/authService'

const { error } = await AuthService.assignTeacherToClass(
  teacherId,           // user ID
  sessionClassSectionId, // class to assign
  subjectId,           // subject (optional)
  isClassTeacher       // boolean
)
```

### Scenario 3: Link Parent to Student

```typescript
// lib/authService.ts

import { AuthService } from '@/lib/authService'

const { error } = await AuthService.linkParentToStudent(
  parentId,
  studentId,
  'father' // relationship type
)
```

### Scenario 4: Check Access Before Rendering

```tsx
'use client'

import { useAuth } from '@/app/providers/AuthProvider'

export function StudentsList() {
  const { hasPermission, authUser } = useAuth()

  // Can't read students?
  if (!hasPermission('students', 'read')) {
    return <AccessDenied />
  }

  // Can't delete students?
  const canDelete = hasPermission('students', 'delete')

  return (
    <div>
      {students.map(student => (
        <StudentRow
          key={student.id}
          student={student}
          onDelete={canDelete ? handleDelete : undefined}
        />
      ))}
    </div>
  )
}
```

---

## Troubleshooting

### Issue: Permission denied errors from API

**Cause:** RLS policies blocking queries

**Solution:**
1. Verify user has auth session
2. Check RLS policies in Supabase dashboard
3. Verify school_id matches user's school
4. Check user_roles table for active roles

### Issue: Permissions not updating after role change

**Cause:** Permission cache not invalidated

**Solution:**
```typescript
// Manually refresh
import { useAuth } from '@/app/providers/AuthProvider'

const { refreshRoles } = useAuth()
await refreshRoles()
```

### Issue: Cross-school data access

**Cause:** Missing school_id filters in queries

**Solution:**
```typescript
// Always filter by school
const query = supabase
  .from('students')
  .select('*')
  .eq('school_id', userSchoolId) // Important!
```

### Issue: Student can access other student's records

**Cause:** RLS policy not restrictive enough

**Solution:**
1. Review RLS policies in `002_add_rls_policies.sql`
2. Test policies with different roles
3. Verify enrollment relationships are correct

---

## Security Best Practices

1. **Always check server-side**: Never trust client-side permission checks alone
2. **Validate school context**: Ensure users can only access their school's data
3. **Use RLS policies**: Database-level access control is most secure
4. **Cache carefully**: Invalidate permission cache when roles change
5. **Audit logs**: Log all sensitive operations
6. **Validate inputs**: Check required fields on both client and server
7. **Handle errors gracefully**: Don't expose sensitive info in error messages

---

## Next Steps

1. ✅ Deploy migrations to Supabase
2. ✅ Test authentication flow
3. ✅ Create dashboard pages for each role
4. ✅ Build role-specific components
5. ✅ Set up audit logging
6. ✅ Configure rate limiting on APIs
7. ✅ Load test permission checks
8. ✅ Document role-specific workflows
