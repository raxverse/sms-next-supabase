# Types Directory (`src/types/`)

## Purpose
Centralized TypeScript type definitions for the entire application. All shared types should be defined here for consistency and easy imports.

## Files

### `index.ts`
Barrel export file that re-exports from other type files:
- `user.ts`
- `dashboard.ts`
- `school.ts`

### `user.ts`
User and authentication related types:
- `UserProfile`: User profile data structure
- `Student`: Student record type
- `AttendanceRecord`: Attendance tracking type

### `dashboard.ts`
Dashboard data types:
- `DashboardStat`: Statistics card data
- `PendingAction`: Action items requiring attention
- `Activity`: Recent activity feed items

### `school.ts`
School and academic structure types:
- `School`: School information
- `Session`: Academic session/year
- `SessionClassSection`: Class-section combination
- `Class`: Class definition
- `Section`: Section/stream definition
- `Subject`: Subject definition
- `Exam`: Exam type
- `ExamMark`: Mark record
- `StudentFeeStatus`: Fee payment status

### `rbac.ts`
**IMPORTANT**: Complete RBAC (Role-Based Access Control) types
- `RoleType`: All possible roles (superadmin, schooladmin, teacher, classteacher, student, parent)
- `Role`: Role definition with permissions
- `Permission`: Granular permission (resource + action)
- `Resource`: All securable resources (schools, users, students, fees, exams, etc.)
- `Action`: All actions (create, read, update, delete, list, assign, etc.)
- `UserRole`: User-role assignment with school context
- `AuthUser`: Extended user with full RBAC context
- `TeacherClassAssignment`: Teacher-to-class mapping
- `ParentStudentRelationship`: Parent-ward mapping
- `AuthorizationContext`: Auth context for checks
- `PermissionCheckResult`: Permission check response
- Dashboard data types for each role
- `AuditLog`: System audit trail
- `CacheEntry`: Permission cache structure

### `database.ts`
Auto-generated Supabase database types:
- `Tables`: All table row types
- `TablesInsert`: Insert operation types
- `TablesUpdate`: Update operation types
- `Json`: JSON data type

## Usage Guidelines
```tsx
import type { UserProfile, Student } from '@types';
import type { RoleType, AuthUser } from '@types/rbac';
import type { Tables } from '@types/database';
```

## RBAC Permissions Format
Permissions follow the pattern: `resource:action`
Examples:
- `students:read` - View student records
- `fee_payments:create` - Record fee payments
- `users:update` - Update user information
