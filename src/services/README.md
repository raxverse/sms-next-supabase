# Services Directory (`src/services/`)

## Purpose
Data fetching and API service layer. Services handle communication with backend APIs and external services.

## Files

### `dashboardService.ts`
**Purpose**: Dashboard data fetching services
- `getDashboardStats()`: Fetch dashboard statistics
- `getPendingActions()`: Fetch pending action items
- `getRecentActivities()`: Fetch recent activity feed

**Note**: Currently uses mock data from constants. Will be replaced with Supabase queries.

## Service Guidelines
1. **Single responsibility**: Each service handles one domain
2. **Return promises**: All service functions are async
3. **Type returns**: Define return types clearly
4. **Handle errors**: Throw meaningful errors
5. **No UI logic**: Services only handle data, not UI

## Usage Example
```tsx
import { getDashboardStats } from '@services/dashboardService';

async function loadData() {
  const stats = await getDashboardStats();
  // stats: DashboardStat[]
}
```

## Planned Services
As the application grows, add:
- `schoolService.ts`: School CRUD operations
- `studentService.ts`: Student management
- `feeService.ts`: Fee collection and records
- `examService.ts`: Exam and marks management
- `userService.ts`: User administration
