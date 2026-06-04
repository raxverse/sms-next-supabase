import { DashboardStat, PendingAction, Activity } from '@/app/types'
import { DASHBOARD_STATS, PENDING_ACTIONS_DATA, RECENT_ACTIVITIES_DATA } from '@/app/utils/constants'

export async function getDashboardStats(): Promise<DashboardStat[]> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('dashboard_stats').select('*')
  return DASHBOARD_STATS
}

export async function getPendingActions(): Promise<PendingAction[]> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('pending_actions').select('*')
  return PENDING_ACTIONS_DATA
}

export async function getRecentActivities(): Promise<Activity[]> {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase.from('activities').select('*')
  return RECENT_ACTIVITIES_DATA
}
