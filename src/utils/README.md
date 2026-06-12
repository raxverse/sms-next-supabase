# Utils Directory (`src/utils/`)

## Purpose
Utility functions, constants, and helper methods that don't fit into other categories.

## Files

### `constants.ts`
**Purpose**: Application-wide constants and configurations

**Exports**:
- `SIDEBAR_MENU_SECTIONS`: Admin sidebar menu configuration
- `DASHBOARD_STATS`: Default dashboard statistics data
- `PENDING_ACTIONS_DATA`: Mock pending actions
- `RECENT_ACTIVITIES_DATA`: Mock recent activities

**Sidebar Configuration**:
```tsx
interface SidebarMenuItem {
  icon: LucideIcon;      // Icon component
  label: string;         // Display text
  href: string;          // Navigation path
}

interface SidebarMenuSection {
  title: string;         // Section heading
  items: SidebarMenuItem[];
}
```

## Utility Guidelines
1. **Pure functions**: No side effects
2. **No external dependencies**: Self-contained
3. **Well typed**: TypeScript types for all exports
4. **Document complex logic**: Comments for non-obvious code

## Usage Example
```tsx
import { SIDEBAR_MENU_SECTIONS } from '@utils/constants';
import { DASHBOARD_STATS } from '@utils/constants';
```

## Planned Utilities
- `formatters.ts`: Date, number, currency formatting
- `validators.ts`: Form validation functions
- `helpers.ts`: General helper functions
- `constants/school.ts`: School-specific constants
