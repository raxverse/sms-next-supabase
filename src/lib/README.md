# Lib Directory (`src/lib/`)

## Purpose
Core libraries and services that handle business logic, authentication, authorization, and database operations. This is where your application's "brains" live.

## Files

### `supabaseClient.ts`
**Purpose**: Supabase client initialization and configuration
- Creates the Supabase client instance
- Exports for use throughout the application
- Handles connection to PostgreSQL database

### `authService.ts`
**Purpose**: Authentication and user management operations
- `createUserWithRole()`: Create new users with role assignment
- `updateUserRoles()`: Modify user roles
- `deactivateUser()`: Deactivate user accounts
- `activateUser()`: Reactivate user accounts
- `updateUserProfile()`: Update user profile data
- `changePassword()`: Password management
- `getUserWithContext()`: Fetch user with full RBAC context
- `assignTeacherToClass()`: Teacher class assignments
- `linkParentToStudent()`: Parent-student relationships

### `authorizationService.ts`
**Purpose**: Permission and role checking logic
- `hasRole()`: Check if user has specific role
- `hasAnyRole()`: Check for any of multiple roles
- `hasPermission()`: Check resource:action permission
- `canAccessSchool()`: Multi-tenant school access check
- `canAccessStudent()`: Student data access verification
- `getCapabilities()`: Get all user capabilities
- `buildAuthUser()`: Build full auth context for user

### `permissionCache.ts`
**Purpose**: In-memory caching for RBAC data
- Caches user permissions with TTL (30 minutes)
- Caches user roles with TTL
- Caches school data
- Cache invalidation methods
- Reduces database queries for permission checks

### `profileService.ts`
**Purpose**: User profile CRUD operations
- `getUserProfile()`: Fetch user profile
- `updateUserProfile()`: Update profile data
- `createUserProfile()`: Create new profile

### `apiProtection.ts`
**Purpose**: API route security utilities
- `requireAuth()`: Enforce authentication
- `requireRole()`: Require specific role(s)
- `requirePermission()`: Require specific permission
- `requireAdmin()`: Require admin (super/school admin)
- `apiRoute()`: Wrapper for protected API routes
- `apiRouteAdminOnly()`: Admin-only API wrapper
- HTTP response helpers: `success()`, `unauthorized()`, `forbidden()`, etc.

## Import Guidelines
```tsx
import { supabase } from '@lib/supabaseClient';
import { AuthService } from '@lib/authService';
import { AuthorizationService } from '@lib/authorizationService';
```
