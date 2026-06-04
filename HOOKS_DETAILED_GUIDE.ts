// ============================================
// VISUAL COMPARISON: How Data Flows
// ============================================

// SCENARIO 1: Initial Load (What Happens First Time)

/*
┌─────────────────────────────────────────────────────┐
│ STEP 1: User opens /admin (Page Load)               │
│                                                      │
│ Browser renders DashboardPage component             │
│ useDashboardStats() hook called                     │
│ State: { stats: [], isLoading: true, error: null }  │
│ Render: <div>Loading...</div>                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ STEP 2: useEffect Runs (After render)               │
│                                                      │
│ getDashboardStats() called                          │
│ If Supabase: Query runs, waits 100-500ms            │
│ If API: HTTP request sent, waits for response       │
│ If Constants: Returns instantly                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ STEP 3: Data Returns                                │
│                                                      │
│ [                                                   │
│   { id: 'students', title: 'Total Students',        │
│     value: '12,540', icon: 'Users' },               │
│   { id: 'teachers', title: 'Teachers',              │
│     value: '640', icon: 'GraduationCap' },          │
│   ...                                               │
│ ]                                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ STEP 4: State Updates                               │
│                                                      │
│ setStats(data)    ← Updates stats state             │
│ setIsLoading(false) ← Updates loading state         │
│                                                      │
│ New state: {                                        │
│   stats: [...real data...],                         │
│   isLoading: false,                                 │
│   error: null                                       │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ STEP 5: Component Re-renders                        │
│                                                      │
│ React detects state change                          │
│ DashboardPage re-renders with new data              │
│ <StatsGrid stats={stats} />                         │
│ Receives real stats data                            │
│ Renders 6 stat cards                                │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ STEP 6: User Sees Dashboard                         │
│                                                      │
│ ✅ Loading spinner gone                             │
│ ✅ Stats cards visible                              │
│ ✅ Real data displayed                              │
│ ✅ User can interact                                │
└─────────────────────────────────────────────────────┘
*/

// ============================================
// SCENARIO 2: Data Changes (What Happens When DB Updates)
// ============================================

/*
SITUATION: Admin updates a stat in Supabase

┌─────────────────────────────────────────────────────┐
│ Admin changes 'Total Students' from 12,540 → 13,000  │
│ in Supabase dashboard                               │
└─────────────────────────────────────────────────────┘
                        ↓
             (IF using real-time subscription)
                        ↓
┌─────────────────────────────────────────────────────┐
│ Supabase sends notification:                         │
│ "dashboard_stats table changed!"                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Hook's subscription catches change:                  │
│                                                      │
│ payload = {                                         │
│   eventType: 'UPDATE',                              │
│   new: { id: 'students', value: '13,000', ... }   │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Hook refetches data:                                │
│ getDashboardStats()                                 │
│ Gets updated data from Supabase                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ State updates:                                       │
│ setStats([...updated data...])                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Component re-renders automatically                   │
│ Total Students card now shows: 13,000               │
│ User sees update WITHOUT refreshing page!           │
└─────────────────────────────────────────────────────┘
*/

// ============================================
// SCENARIO 3: Error Handling
// ============================================

/*
SITUATION: Network fails or Supabase is down

┌─────────────────────────────────────────────────────┐
│ User opens /admin                                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Hook tries to fetch:                                │
│ await getDashboardStats()                           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Service tries to query Supabase:                     │
│ const { data, error } = await supabase...           │
│ error = "Network failed"  ❌                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Service catches error:                               │
│ if (error) throw error                              │
│ console.error('Error fetching...', error)           │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Hook catches error:                                 │
│ catch (err) {                                       │
│   setError(err)  ← Store error in state             │
│   setStats([])   ← Clear data                       │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ Component checks for error:                          │
│ if (error) {                                        │
│   return <div>Error: {error.message}</div>          │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ User sees friendly error message:                    │
│ "Error loading dashboard"                           │
│ (Instead of blank screen or crash)                  │
└─────────────────────────────────────────────────────┘
*/

// ============================================
// DIFFERENT DATA SOURCES - SAME HOOK
// ============================================

// Hook stays the same no matter what data source you use!

// OPTION 1: Hardcoded (Current)
export async function getDashboardStats(): Promise<DashboardStat[]> {
  return DASHBOARD_STATS
}

// OPTION 2: Supabase (PostgreSQL)
export async function getDashboardStats(): Promise<DashboardStat[]> {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
  if (error) throw error
  return data || []
}

// OPTION 3: REST API (Node.js/Express)
export async function getDashboardStats(): Promise<DashboardStat[]> {
  const response = await fetch('http://api.example.com/dashboard-stats')
  const data = await response.json()
  return data
}

// OPTION 4: Firebase Realtime Database
export async function getDashboardStats(): Promise<DashboardStat[]> {
  const snapshot = await firebase
    .database()
    .ref('dashboard/stats')
    .get()
  return snapshot.val() || []
}

// OPTION 5: GraphQL API
export async function getDashboardStats(): Promise<DashboardStat[]> {
  const { data } = await apolloClient.query({
    query: GET_DASHBOARD_STATS
  })
  return data.dashboardStats
}

// OPTION 6: MongoDB/Mongoose
export async function getDashboardStats(): Promise<DashboardStat[]> {
  const data = await DashboardStat.find({}).exec()
  return data
}

/*
ALL of these work with the SAME HOOK!
The hook doesn't care about implementation.

This is why separating concerns is important:
- Service layer handles "WHERE" data comes from
- Hook handles "HOW" data is managed in component
- UI only cares about receiving data
*/

// ============================================
// COMMON PATTERNS & BEST PRACTICES
// ============================================

// PATTERN 1: Refetch Data (Manual Refresh)

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = async () => {  // Extract to separate function
    try {
      setIsLoading(true)
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, isLoading, error, refetch: fetchStats }  // Return refetch!
}

// Use in component:
export default function DashboardPage() {
  const { stats, isLoading, error, refetch } = useDashboardStats()

  return (
    <div>
      <button onClick={refetch}>🔄 Refresh</button>
      {/* ... rest of component */}
    </div>
  )
}

// PATTERN 2: Refetch on Interval (Poll every 5 seconds)

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()

    // Poll every 5 seconds
    const interval = setInterval(fetchStats, 5000)

    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  return { stats, isLoading, error }
}

// PATTERN 3: Fetch Based on Dependencies

export function useSchools(schoolId?: string) {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!schoolId) return  // Don't fetch if no ID

    const fetchSchool = async () => {
      try {
        const { data } = await supabase
          .from('schools')
          .select('*')
          .eq('id', schoolId)  // Filter by ID
        setSchools(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchool()
  }, [schoolId])  // Re-fetch when schoolId changes

  return { schools, isLoading, error }
}

// PATTERN 4: Combine Multiple Hooks

export default function SchoolDetailPage({ id }: { id: string }) {
  const { schools, isLoading: schoolLoading } = useSchools(id)
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { users, isLoading: usersLoading } = useUsers(id)

  const isLoading = schoolLoading || statsLoading || usersLoading

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <SchoolInfo school={schools[0]} />
      <StatsGrid stats={stats} />
      <UsersList users={users} />
    </div>
  )
}

// ============================================
// KEY TAKEAWAYS
// ============================================

/*
1. HOOKS are functions that manage state and side effects
   - useState: Manages component memory
   - useEffect: Runs code after render
   - Custom hooks: Combine both for reusable logic

2. DATA FLOW:
   Component → Hook → Service → Database
   Database → Service → Hook → Component → UI

3. SEPARATION OF CONCERNS:
   - Service: "Get data from database"
   - Hook: "Manage loading/error states"
   - Component: "Display the data"

4. ADVANTAGES:
   - Change database once, all hooks work
   - Reuse hooks across components
   - Easy to test each layer
   - Clear data flow (easier to debug)

5. STATE MANAGEMENT:
   - setState updates → React re-renders automatically
   - New props passed to children → They re-render
   - UI always in sync with state

6. REAL-TIME:
   - Subscribe to database changes
   - Update state when changes detected
   - UI updates without page refresh

This architecture is PRODUCTION-READY!
*/
