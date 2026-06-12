# Project Structure Overview

This School Management System follows an enterprise-grade, domain-driven directory structure. Below is a comprehensive guide to help you understand the project organization.

## Directory Structure

```
src/
├── app/                    # Next.js App Router - Routes, layouts, API endpoints
├── components/             # Reusable UI and layout components
├── features/               # Domain-specific business logic modules
├── hooks/                  # Custom React hooks for state management
├── lib/                    # Core libraries and services
├── services/               # API and data fetching services
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions and constants
├── experiments/            # Experimental/test pages (not production routes)
└── migrations/             # Database migration SQL files
```

## Path Aliases

The project uses TypeScript path aliases for clean imports:
- `@/` → points to `./src/`
- `@app/*` → `./src/app/*`
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@lib/*` → `./src/lib/*`
- `@types/*` → `./src/types/*`
- `@services/*` → `./src/services/*`
- `@utils/*` → `./src/utils/*`

## Key Principles

1. **Separation of Concerns**: Routes only handle HTTP, business logic lives in services/lib
2. **Feature-Based Organization**: Related code grouped by domain (academic, auth, dashboard)
3. **Reusable Components**: Generic UI components in `components/ui/`
4. **Type Safety**: All types consolidated in `types/` directory

## Multi-Tenancy & RBAC

This system supports multiple schools with role-based access control:
- Super Admin: Full system access
- School Admin: School-level management
- Teacher/Class Teacher: Class and subject management
- Student: View own records
- Parent: View ward's records
