'use client'

import { useEffect, useState } from 'react'
import { DashboardStat } from '@/app/types'
import { getDashboardStats } from '@/app/services/dashboardService'

interface UseDashboardStatsReturn {
  stats: DashboardStat[]
  isLoading: boolean
  error: Error | null
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch stats'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, isLoading, error }
}
