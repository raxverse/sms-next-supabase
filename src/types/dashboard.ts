export interface DashboardStat {
  id: string
  title: string
  value: string
  icon: string
  subtitle?: string
}

export interface PendingAction {
  id: string
  name: string
  count: number
}

export interface Activity {
  id: string
  title: string
  time: string
}
