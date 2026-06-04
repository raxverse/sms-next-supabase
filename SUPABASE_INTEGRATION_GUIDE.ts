// ============================================
// STEP-BY-STEP: Connect to Supabase
// ============================================

// STEP 1: Create Database Tables in Supabase

/*
Go to Supabase dashboard → SQL Editor → Run this:

-- Create dashboard_stats table
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  subtitle TEXT DEFAULT 'All Schools',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create pending_actions table
CREATE TABLE IF NOT EXISTS pending_actions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO dashboard_stats (title, value, icon, subtitle) VALUES
('Total Students', '12,540', 'Users', 'All Schools'),
('Teachers', '640', 'GraduationCap', 'All Schools'),
('Fee Collection', '₹4.2 Cr', 'IndianRupee', 'All Schools'),
('Attendance Today', '96.4%', 'Calendar', 'All Schools'),
('Active Buses', '18', 'Bus', 'All Schools'),
('Schools Managed', '12', 'School', 'All Schools');

INSERT INTO pending_actions (name, count) VALUES
('Admissions Pending', 15),
('TC Requests', 8),
('Certificate Requests', 23),
('Leave Requests', 11),
('Fee Approvals', 5);

INSERT INTO activities (title, time) VALUES
('New Student Added', '10:30 AM'),
('Fee Received', '09:45 AM'),
('Result Published', 'Yesterday'),
('TC Generated', 'Yesterday');
*/

// ============================================
// STEP 2: Update Service Layer
// ============================================

// File: app/services/dashboardService.ts

import { supabase } from '@/lib/supabaseClient'
import { DashboardStat, PendingAction, Activity } from '@/app/types'

// BEFORE: Hardcoded data
// export async function getDashboardStats(): Promise<DashboardStat[]> {
//   return DASHBOARD_STATS
// }

// AFTER: Real database
export async function getDashboardStats(): Promise<DashboardStat[]> {
  try {
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return []  // Return empty array as fallback
  }
}

export async function getPendingActions(): Promise<PendingAction[]> {
  try {
    const { data, error } = await supabase
      .from('pending_actions')
      .select('*')
      .order('count', { ascending: false })  // Highest count first

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching pending actions:', error)
    return []
  }
}

export async function getRecentActivities(): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

// ============================================
// STEP 3: No Changes Needed to Hooks or UI!
// ============================================

// The hooks work the same way:
// - useDashboardStats() still calls getDashboardStats()
// - getDashboardStats() now returns from Supabase instead of constants
// - The hook doesn't care about the data source

// The UI works the same way:
// - DashboardPage still calls the hooks
// - StatsGrid still displays the data
// - Everything works automatically!

// ============================================
// STEP 4: Test It
// ============================================

/*
1. Update the service file (dashboardService.ts)
2. Run: npm run dev
3. Open http://localhost:3000/admin
4. Open browser console (F12)
5. Watch the data flow from Supabase:

   🏠 DashboardPage component rendering
   📡 Effect running - starting data fetch
   🔄 Loading...
   📦 Service: Fetching from Supabase...
   ✅ Data from Supabase: [...]  ← Real database data!
   📊 StatsGrid rendering with data

6. The dashboard displays real data from your database!
*/

// ============================================
// BONUS: Add a New Stat to Dashboard (Real-time)
// ============================================

/*
To add a new stat that updates in real-time:

1. Go to Supabase dashboard → SQL Editor
2. Run:
   INSERT INTO dashboard_stats (title, value, icon) VALUES
   ('New Stat', '999', 'Plus')

3. Refresh your dashboard (F5)
4. NEW stat appears immediately!

The data flow:
UI → Hook → Service → Supabase Database → Service → Hook → UI
*/

// ============================================
// ERROR HANDLING
// ============================================

// What if Supabase is down?
// The service returns empty array [], so UI shows:
// - Loading spinner disappears
// - No data displays
// - No crash!

// What if query has an error?
// The service catches it with try/catch:
// - Logs error to console
// - Returns empty array as fallback
// - UI handles gracefully

// To show error message to user:

export default function DashboardPage() {
  const { stats, isLoading, error } = useDashboardStats()

  if (error) {
    return (
      <div className="p-8 bg-red-100 text-red-700 rounded">
        <h2>Error Loading Dashboard</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    // ... rest of component
  )
}

// ============================================
// ADVANCED: Real-Time Updates
// ============================================

// To see changes from OTHER users in real-time:

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Fetch initial data
    const fetchStats = async () => {
      const data = await getDashboardStats()
      setStats(data)
      setIsLoading(false)
    }

    fetchStats()

    // Subscribe to real-time changes
    const channel = supabase
      .channel('dashboard_stats')
      .on(
        'postgres_changes',
        {
          event: '*',  // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'dashboard_stats',
        },
        (payload) => {
          console.log('📡 Real-time update received:', payload)
          // When data changes in database, update UI immediately
          fetchStats()
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { stats, isLoading, error }
}

/*
Now when ANY admin changes a stat value in Supabase,
ALL connected admins see the change in real-time
WITHOUT refreshing the page!

Example scenario:
- Admin A changes 'Total Students' from 12,540 to 13,000
- Admin B's dashboard updates automatically in 50-100ms
- No refresh needed!
*/

// ============================================
// COMPLETE DATA FLOW VISUAL
// ============================================

/*
                    SUPABASE DATABASE
                    ┌────────────────┐
                    │ dashboard_stats│
                    │ pending_actions│
                    │  activities    │
                    └────────┬────────┘
                             │
                      ← Supabase queries ←
                             │
                             ▼
                    ┌────────────────────┐
                    │  Service Layer     │
                    │ dashboardService.ts│
                    │                    │
                    │ getDashboardStats()│
                    │getPendingActions() │
                    │getRecentActivities│
                    └────────┬───────────┘
                             │
                      ← Function calls ←
                             │
                             ▼
                    ┌────────────────────┐
                    │   Hooks (Logic)    │
                    │                    │
                    │useDashboardStats() │
                    │usePendingActions() │
                    │useRecentActivities│
                    │                    │
                    │ Returns:           │
                    │ { data, loading,   │
                    │   error }          │
                    └────────┬───────────┘
                             │
                      ← Props passed ←
                             │
                             ▼
                    ┌────────────────────┐
                    │   UI Components    │
                    │                    │
                    │ DashboardPage.tsx │
                    │ StatsGrid.tsx      │
                    │ StatsCard.tsx      │
                    └────────┬───────────┘
                             │
                      ← Renders HTML ←
                             │
                             ▼
                    ┌────────────────────┐
                    │    User Browser    │
                    │                    │
                    │ Sees dashboard     │
                    │ with real data!    │
                    └────────────────────┘
*/

// ============================================
// SUMMARY
// ============================================

/*
CURRENT STATE (Hardcoded Data):
┌──────────────────────────────────────────────────┐
│ Hook → Service → CONSTANTS → Hook → UI → Browser │
└──────────────────────────────────────────────────┘

TO CONNECT TO SUPABASE (Just update service):
┌──────────────────────────────────────────────────────────────┐
│ Hook → Service → SUPABASE DATABASE → Service → Hook → UI → Browser │
└──────────────────────────────────────────────────────────────┘

HOOKS: Don't care where data comes from
UI: Don't care where data comes from
SERVICE: The only place that needs to change!

This is why hooks + services architecture is POWERFUL!
Change database → Only update 1 file (service)
Everything else works automatically!
*/
