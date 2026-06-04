// ============================================
// COMPLETE DATA FLOW EXAMPLE FOR YOUR PROJECT
// ============================================

// ============ FILE 1: Hook (app/hooks/useDashboardStats.ts) ============

'use client'

import { useEffect, useState } from 'react'
import { DashboardStat } from '@/app/types'
import { getDashboardStats } from '@/app/services/dashboardService'

// STEP 1: Define what this hook returns (TypeScript)
interface UseDashboardStatsReturn {
  stats: DashboardStat[]           // Array of stat objects
  isLoading: boolean               // Loading state
  error: Error | null              // Error if fetch fails
}

// STEP 2: Export the hook function
export function useDashboardStats(): UseDashboardStatsReturn {
  console.log('🎣 Hook initialized - setting up state')

  // STEP 3: Create state variables (component memory)
  const [stats, setStats] = useState<DashboardStat[]>([])
  // Initial value: stats = []
  // When you call setStats(newData), React updates stats and re-renders component

  const [isLoading, setIsLoading] = useState(true)
  // Initial value: isLoading = true (we're fetching)
  // When data arrives: setIsLoading(false) (done fetching)

  const [error, setError] = useState<Error | null>(null)
  // Initial value: error = null (no error yet)
  // If fetch fails: setError(new Error('message'))

  // STEP 4: Run code when component mounts (useEffect)
  useEffect(() => {
    console.log('📡 Effect running - starting data fetch')

    const fetchStats = async () => {
      try {
        console.log('🔄 Loading...')
        setIsLoading(true)  // Show loading spinner

        // Call service to get data
        const data = await getDashboardStats()
        console.log('✅ Data received:', data)

        setStats(data)  // Store data in state
      } catch (err) {
        console.log('❌ Error:', err)
        setError(err instanceof Error ? err : new Error('Failed to fetch'))
      } finally {
        console.log('⏹️ Fetch complete')
        setIsLoading(false)  // Hide loading spinner
      }
    }

    fetchStats()
  }, [])  // Empty array = run ONCE when component mounts

  console.log('🎣 Hook returning:', { stats, isLoading, error })

  // STEP 5: Return data to component
  return { stats, isLoading, error }
}

// ==== FILE 2: Service (app/services/dashboardService.ts) ====

import { supabase } from '@/lib/supabaseClient'
import { DashboardStat } from '@/app/types'
import { DASHBOARD_STATS } from '@/app/utils/constants'

// CURRENTLY: Returns hardcoded data
export async function getDashboardStats(): Promise<DashboardStat[]> {
  console.log('📦 Service: getDashboardStats() called')
  console.log('ℹ️  Currently returning hardcoded data from constants')

  return DASHBOARD_STATS
  // Returns:
  // [
  //   { id: 'students', title: 'Total Students', value: '12,540', icon: 'Users' },
  //   { id: 'teachers', title: 'Teachers', value: '640', icon: 'GraduationCap' },
  //   ...
  // ]
}

// ============ TO CONNECT TO SUPABASE - Replace with: ============

export async function getDashboardStats(): Promise<DashboardStat[]> {
  console.log('📦 Service: getDashboardStats() - fetching from Supabase')

  // Make request to Supabase
  const { data, error } = await supabase
    .from('dashboard_stats')    // Table name
    .select('*')                // Select all columns
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Supabase error:', error)
    throw error
  }

  console.log('✅ Data from Supabase:', data)
  return data || []
  // Returns:
  // [
  //   { id: 'students', title: 'Total Students', value: '15,230', icon: 'Users', created_at: '2024-06-04' },
  //   { id: 'teachers', title: 'Teachers', value: '680', icon: 'GraduationCap', created_at: '2024-06-04' },
  //   ...
  // ]
}

// ==== FILE 3: UI Component (app/admin/page.tsx) ====

'use client'

import StatsGrid from '@/app/components/dashboard/StatsGrid'
import { useDashboardStats } from '@/app/hooks/useDashboardStats'

export default function DashboardPage() {
  console.log('🏠 DashboardPage component rendering')

  // STEP 1: Call the hook to get data
  const { stats, isLoading, error } = useDashboardStats()
  console.log('🎣 Hook returned:', { stats, isLoading, error })

  // STEP 2: Handle loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <h1>Dashboard</h1>
        <p>Loading...</p>  {/* Show spinner here */}
      </div>
    )
  }

  // STEP 3: Handle error state
  if (error) {
    return (
      <div className="p-8">
        <h1>Dashboard</h1>
        <p>Error: {error.message}</p>  {/* Show error message */}
      </div>
    )
  }

  // STEP 4: Render with data
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mt-2">
        Welcome back, manage your schools efficiently.
      </p>

      {/* Pass data to StatsGrid component */}
      <StatsGrid stats={stats} isLoading={isLoading} />
    </div>
  )
}

// ==== FILE 4: Presentational Component (app/components/dashboard/StatsGrid.tsx) ====

'use client'

import StatsCard from '@/app/components/common/StatsCard'
import { DashboardStat } from '@/app/types'

interface Props {
  stats: DashboardStat[]
  isLoading?: boolean
}

export default function StatsGrid({ stats, isLoading = false }: Props) {
  console.log('📊 StatsGrid rendering with stats:', stats)

  if (isLoading) {
    return <div>Loading stats...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mt-8">
      {/* Loop through each stat and render a card */}
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={getIcon(stat.icon)}
        />
      ))}
    </div>
  )
}

// ============================================
// TIMELINE: What Happens When User Visits /admin
// ============================================

/*
TIME 0:00 - User clicks on /admin
├─ Browser navigates to /admin
│
TIME 0:01 - DashboardPage component mounts
├─ console.log('🏠 DashboardPage component rendering')
├─ Component calls: useDashboardStats()
│
TIME 0:02 - Hook initialization (useDashboardStats)
├─ console.log('🎣 Hook initialized')
├─ useState creates 3 state variables:
│  ├─ stats = []
│  ├─ isLoading = true
│  └─ error = null
├─ Hook returns immediately: { stats: [], isLoading: true, error: null }
├─ Component re-renders with empty data
├─ User sees: Loading spinner (because isLoading = true)
│
TIME 0:03 - Browser finishes initial render
├─ Component is now on screen with loading message
│
TIME 0:04 - useEffect hook runs (componentDidMount)
├─ console.log('📡 Effect running')
├─ fetchStats() async function starts
├─ setIsLoading(true) - already true
│
TIME 0:05 - Service function called
├─ console.log('📦 Service: getDashboardStats()')
├─ Either:
│  ├─ Current: returns DASHBOARD_STATS from constants (instant)
│  └─ Future: queries Supabase database (takes 100-500ms)
│
TIME 0:06 - Data arrives
├─ console.log('✅ Data received')
├─ setStats(data) - updates state with real data
├─ React detects state change
├─ Component re-renders with new data
│
TIME 0:07 - setIsLoading(false) executes
├─ Component re-renders again
├─ Loading message disappears
├─ Stats cards now visible with data
│
TIME 0:08 - Final render complete
├─ User sees: Dashboard with 6 stat cards
│  ├─ Total Students: 12,540
│  ├─ Teachers: 640
│  ├─ Fee Collection: ₹4.2 Cr
│  ├─ Attendance Today: 96.4%
│  ├─ Active Buses: 18
│  └─ Schools Managed: 12
*/

// ============================================
// STATE CHANGES CAUSE RE-RENDERS
// ============================================

/*
Initial state:
{
  stats: [],
  isLoading: true,
  error: null
}

RENDER 1: Empty with spinner

After setStats(data):
{
  stats: [
    { id: 'students', title: 'Total Students', value: '12,540', icon: 'Users' },
    { id: 'teachers', title: 'Teachers', value: '640', icon: 'GraduationCap' },
    ...
  ],
  isLoading: true,
  error: null
}

RENDER 2: Data visible, still loading spinner

After setIsLoading(false):
{
  stats: [...same...],
  isLoading: false,
  error: null
}

RENDER 3: Data visible, NO spinner
*/

// ============================================
// HOW TO TEST THIS LOCALLY
// ============================================

/*
1. Open browser console (F12)
2. Go to http://localhost:3000/admin
3. Watch console logs:
   🏠 DashboardPage component rendering
   🎣 Hook initialized - setting up state
   🎣 Hook returning: { stats: [], isLoading: true, error: null }
   📡 Effect running - starting data fetch
   🔄 Loading...
   📦 Service: getDashboardStats() called
   ✅ Data received: [...]
   ⏹️ Fetch complete
   🎣 Hook returning: { stats: [...], isLoading: false, error: null }
   📊 StatsGrid rendering with stats: [...]

4. You'll see the data flow in real-time!
*/
