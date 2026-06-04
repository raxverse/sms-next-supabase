// ============================================
// QUICK REFERENCE: React Hooks & Data Flow
// ============================================

// WHAT ARE HOOKS?
// Hooks are React functions that let you use React features in functional components.
// They manage state (data memory) and side effects (like fetching data).

// ============================================
// YOUR CUSTOM HOOKS (3 of them)
// ============================================

// HOOK 1: useDashboardStats
import { useDashboardStats } from '@/app/hooks/useDashboardStats'
const { stats, isLoading, error } = useDashboardStats()
// Returns array of stat objects like:
// [
//   { id: 'students', title: 'Total Students', value: '12,540', icon: 'Users' },
//   { id: 'teachers', title: 'Teachers', value: '640', icon: 'GraduationCap' },
// ]

// HOOK 2: usePendingActions
import { usePendingActions } from '@/app/hooks/usePendingActions'
const { actions, isLoading, error } = usePendingActions()
// Returns array like:
// [
//   { id: '1', name: 'Admissions Pending', count: 15 },
//   { id: '2', name: 'TC Requests', count: 8 },
// ]

// HOOK 3: useRecentActivities
import { useRecentActivities } from '@/app/hooks/useRecentActivities'
const { activities, isLoading, error } = useRecentActivities()
// Returns array like:
// [
//   { id: '1', title: 'New Student Added', time: '10:30 AM' },
//   { id: '2', title: 'Fee Received', time: '09:45 AM' },
// ]

// ============================================
// HOW TO USE HOOKS IN COMPONENTS
// ============================================

'use client'

import { useDashboardStats } from '@/app/hooks/useDashboardStats'
import StatsGrid from '@/app/components/dashboard/StatsGrid'

export default function DashboardPage() {
  // CALL HOOK
  const { stats, isLoading, error } = useDashboardStats()

  // HANDLE LOADING
  if (isLoading) {
    return <div>Loading dashboard...</div>
  }

  // HANDLE ERROR
  if (error) {
    return <div>Error: {error.message}</div>
  }

  // DISPLAY DATA
  return (
    <div>
      <h1>Dashboard</h1>
      <StatsGrid stats={stats} isLoading={isLoading} />
    </div>
  )
}

// ============================================
// INTERNAL HOOK STRUCTURE
// ============================================

/*
export function useDashboardStats() {
  // 1. CREATE STATE (component memory)
  const [stats, setStats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // 2. FETCH DATA ON MOUNT
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats()  // Call service
        setStats(data)                          // Store in state
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])  // Empty array = run once

  // 3. RETURN DATA
  return { stats, isLoading, error }
}
*/

// ============================================
// WHERE DOES DATA COME FROM?
// ============================================

// Currently: app/utils/constants.ts (Hardcoded)
import { DASHBOARD_STATS, PENDING_ACTIONS_DATA, RECENT_ACTIVITIES_DATA } from '@/app/utils/constants'
// Returns instantly

// To Connect Supabase: app/services/dashboardService.ts
import { supabase } from '@/lib/supabaseClient'
const { data, error } = await supabase.from('dashboard_stats').select('*')
// Returns from database in 100-500ms

// ============================================
// COMPLETE DATA FLOW DIAGRAM
// ============================================

/*
USER OPENS /admin
        ↓
DashboardPage component renders
        ↓
useDashboardStats() hook called
        ↓
State initialized: { stats: [], isLoading: true }
        ↓
Component renders with loading state
        ↓
useEffect hook runs (after render)
        ↓
getDashboardStats() service function called
        ↓
Service queries database (Supabase/API/Constants)
        ↓
Data returns
        ↓
setStats(data) - updates state
        ↓
React detects state change
        ↓
Component re-renders with new data
        ↓
setIsLoading(false) - hides loading spinner
        ↓
Component re-renders again
        ↓
User sees dashboard with real data
*/

// ============================================
// STATE CHANGES = RE-RENDERS
// ============================================

// When you call setState(), React automatically re-renders component

// Example:
const [count, setCount] = useState(0)
// count = 0 initially
// render: <div>Count: 0</div>

setCount(1)
// count = 1
// React re-renders automatically
// render: <div>Count: 1</div>

// Same with your hooks:
setStats(newData)
// Component re-renders with new stats
// UI updates automatically!

// ============================================
// SWITCHING DATA SOURCE (No Hook Changes!)
// ============================================

// CURRENT: Hardcoded constants
export async function getDashboardStats() {
  return DASHBOARD_STATS
}

// SWITCH TO SUPABASE (Update service ONLY):
export async function getDashboardStats() {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
  if (error) throw error
  return data || []
}

// Hook stays the same!
// Component stays the same!
// Only service changes!
// This is the power of architecture!

// ============================================
// ERROR HANDLING
// ============================================

// Hook returns error in state
const { stats, isLoading, error } = useDashboardStats()

// Component checks for error
if (error) {
  return (
    <div className="text-red-500">
      Failed to load dashboard: {error.message}
      <button onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  )
}

// If error occurs anywhere:
// 1. Service throws error
// 2. Hook catches error with try/catch
// 3. Hook stores error in state: setError(err)
// 4. Component renders error message
// 5. App doesn't crash!

// ============================================
// REAL-TIME UPDATES (Advanced)
// ============================================

// Subscribe to Supabase changes:
useEffect(() => {
  // Fetch initial data
  fetchData()

  // Subscribe to changes
  const channel = supabase
    .channel('dashboard')
    .on('postgres_changes', { event: '*', table: 'dashboard_stats' },
      (payload) => {
        console.log('Data changed!', payload)
        fetchData()  // Refetch automatically
      }
    )
    .subscribe()

  // Cleanup
  return () => supabase.removeChannel(channel)
}, [])

// Now when ANY user changes data, all users see update automatically!

// ============================================
// COMMON QUESTIONS & ANSWERS
// ============================================

// Q: Why use hooks instead of fetching in component?
// A: Separates data logic from UI. Easier to test, reuse, maintain.

// Q: When does useEffect run?
// A: After component renders. Empty [] = run once on mount.
//    [dependency] = run when dependency changes.

// Q: Why setLoading(true) at start?
// A: Shows loading spinner while fetching. Better UX than blank screen.

// Q: Can I use same hook in multiple components?
// A: Yes! Each component gets its own copy. Each has its own state.

// Q: How do I refetch data manually?
// A: Return refetch function from hook, call it on button click.

// Q: How do I know if data is loading?
// A: Check isLoading variable. Show spinner if true.

// Q: What if API is slow (5 seconds)?
// A: UI shows loading spinner. When data arrives, UI updates.

// ============================================
// NEXT STEPS
// ============================================

// 1. Current: Data comes from constants (instant)
// 2. Next: Connect to Supabase (real data)
// 3. Then: Add more pages (schools, users, sessions)
// 4. Later: Add real-time updates
// 5. Finally: Add forms for CRUD operations

// All using same hook + service + component pattern!

// ============================================
// FILES TO KNOW
// ============================================

// When you need to:
//
// ...fetch data from database?
// → Edit app/services/dashboardService.ts
//
// ...handle loading/error states?
// → Edit app/hooks/useDashboardStats.ts
//
// ...display data differently?
// → Edit app/components/dashboard/StatsGrid.tsx
//
// ...change styling/layout?
// → Edit app/components/common/StatsCard.tsx

// Each file has ONE responsibility. Easy to maintain!

// ============================================
// SUMMARY
// ============================================

/*
HOOKS:     Manage data state and fetch logic
SERVICES:  Query database/API
TYPES:     Define data structure
UTILS:     Store constants and helpers
COMPONENTS: Display data

Data Flow: Component → Hook → Service → Database
           Database → Service → Hook → Component → UI

When database updates:
  setState() → React re-renders → UI shows new data

This is production-ready architecture!
Use it for all future features!
*/
