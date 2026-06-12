'use client'

import { useEffect, useState } from 'react'
import { Activity } from '@/types'
import { getRecentActivities } from '@/services/dashboardService'

interface UseRecentActivitiesReturn {
  activities: Activity[]
  isLoading: boolean
  error: Error | null
}

export function useRecentActivities(): UseRecentActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)
        const data = await getRecentActivities()
        setActivities(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch activities'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  return { activities, isLoading, error }
}
