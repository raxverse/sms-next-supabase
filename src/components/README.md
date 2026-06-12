# Components Directory (`src/components/`)

## Purpose
Reusable UI components, layouts, and shared visual elements. Components here should be presentation-focused and not contain business logic.

## Subdirectories

### `ui/` - Generic UI Components
Stateless, reusable design elements that can be used anywhere:
- **Button.tsx**: Primary, secondary, outline, danger buttons
- **Card.tsx**: Cards, stat cards, list cards
- **Badge.tsx**: Status badges, labels
- **Input.tsx**: Text inputs, textareas, selects, search inputs
- **Loading.tsx**: Skeletons, spinners, loading states
- **EmptyState.tsx**: Empty data states, error states, permission states
- **UI.tsx**: Basic text, paragraph, button components

### `layouts/` - Page Layout Components
Full-page layout wrappers:
- **AdminLayout.tsx**: Admin dashboard layout with sidebar and topbar

### `common/` - Shared Application Components
Components used across multiple pages:
- **Header.tsx**: Global navigation header
- **Sidebar.tsx**: Admin sidebar navigation
- **Topbar.tsx**: Admin top navigation bar
- **StatsCard.tsx**: Dashboard statistics card

### `auth/` - Authentication Components
- **AuthForm.tsx**: Login/Signup form
- **PermissionGuard.tsx**: RBAC permission guards (RoleGuard, AdminGuard, etc.)

### `admin/` - Admin-Specific Components
- **DataTable.tsx**: Sortable, searchable data table
- **PageHeader.tsx**: Page title and action header
- **StatusBadge.tsx**: Status indicator badges
- **ActionButtons.tsx**: Create, edit, delete buttons
- **FormSection.tsx**: Form grouping components
- **SearchBar.tsx**: Search input with debounce
- **ResponsiveSheet.tsx**: Mobile-friendly bottom sheet

### `dashboard/` - Dashboard Components
- **StatsGrid.tsx**: Grid of stat cards
- **PendingActionsCard.tsx**: Pending actions list
- **RecentActivitiesCard.tsx**: Recent activity feed

## Component Guidelines
1. **Keep components pure**: No direct API calls in UI components
2. **Use TypeScript interfaces**: Define props clearly
3. **Forward refs when needed**: For DOM access
4. **Export from index.ts**: Barrel exports for clean imports
