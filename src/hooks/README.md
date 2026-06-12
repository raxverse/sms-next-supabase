# Hooks Directory (`src/hooks/`)

## Purpose
Custom React hooks for state management, side effects, and reusable logic patterns. Hooks encapsulate complex state logic in a reusable way.

## Files

### `useAuthLogic.ts`
**Purpose**: Authentication form state management
- Handles login/signup form state
- Manages authentication flow
- Handles Supabase auth operations
- Provides form handlers and state

**Returns**:
- `firstname`, `setFirstname`: First name input
- `lastname`, `setLastname`: Last name input
- `email`, `setEmail`: Email input
- `password`, `setPassword`: Password input
- `mode`, `setMode`: Login/Signup toggle
- `handleLogin()`: Login handler
- `handleSignup()`: Signup handler
- `handleLogout()`: Logout handler
- Error and status message state

### `useDashboardStats.ts`
**Purpose**: Fetch and manage dashboard statistics
- Fetches stats on mount
- Handles loading state
- Error handling

**Returns**:
- `stats`: DashboardStat[] - Array of statistics
- `isLoading`: boolean
- `error`: Error | null

### `usePendingActions.ts`
**Purpose**: Fetch pending action items
- Fetches items requiring attention
- Used in admin dashboard

**Returns**:
- `actions`: PendingAction[] - Array of pending items
- `isLoading`: boolean
- `error`: Error | null

### `useRecentActivities.ts`
**Purpose**: Fetch recent activity feed
- Fetches recent system activities
- Used in admin dashboard sidebar

**Returns**:
- `activities`: Activity[] - Array of recent items
- `isLoading`: boolean
- `error`: Error | null

## Hook Guidelines
1. **Prefix with `use`**: All hooks must start with "use"
2. **Return object**: Return an object for named destructuring
3. **Handle loading**: Always provide loading state
4. **Handle errors**: Always provide error state
5. **Use TypeScript**: Define return types explicitly

## Usage Example
```tsx
import { useDashboardStats } from '@hooks/useDashboardStats';
import { useAuthLogic } from '@hooks/useAuthLogic';

function MyComponent() {
  const { stats, isLoading } = useDashboardStats();
  const { email, handleLogin } = useAuthLogic();
  
  // ...
}
```
