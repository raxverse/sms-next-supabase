# Features Directory (`src/features/`)

## Purpose
Domain-driven feature modules that group related business logic. Each feature contains its own types, hooks, services, and domain-specific components.

## Feature Modules

### `academic/`
**Purpose**: Academic management domain
- Schools, sessions, classes, sections
- Academic year configuration
- Class-teacher assignments

**Should contain**:
- `types.ts`: Academic-specific types
- `hooks/`: Academic data hooks
- `components/`: Class, session, school components
- `services/`: Academic API services

### `dashboard/`
**Purpose**: Dashboard and analytics domain
- Statistics and metrics
- Charts and visualizations
- Pending actions, activities

**Should contain**:
- `types.ts`: Dashboard data types
- `hooks/`: Dashboard data hooks
- `components/`: Stats cards, charts

### `auth/`
**Purpose**: Authentication and authorization domain
- Login/signup flows
- Permission guards
- Role management

**Should contain**:
- `types.ts`: Auth types
- `hooks/`: Auth hooks
- `components/`: Auth forms, guards

### `user/`
**Purpose**: User management domain
- User profiles
- Role assignments
- User administration

### `fee/`
**Purpose**: Fee management domain
- Fee structures
- Payment records
- Fee reports

### `exam/`
**Purpose**: Exam management domain
- Exam schedules
- Marks entry
- Results

### `student/`
**Purpose**: Student management domain
- Student profiles
- Enrollments
- Student reports

## Feature Structure Template
```
features/[feature-name]/
├── index.ts              # Barrel exports
├── types.ts              # Feature-specific types
├── hooks/
│   └── use[Feature].ts   # Feature hooks
├── components/
│   └── [Component].tsx   # Feature components
└── services/
    └── [feature]Service.ts # Feature services
```

## Guidelines
1. **Self-contained**: Feature should work independently
2. **Clear boundaries**: Don't mix feature logic
3. **Shared code**: Use `../shared/` for cross-feature code
4. **Export from index**: Clean imports via barrel files
