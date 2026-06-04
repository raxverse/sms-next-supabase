'use client'

import { useEffect, useState } from 'react'
import { PendingAction } from '@/app/types'
import { getPendingActions } from '@/app/services/dashboardService'

interface UsePendingActionsReturn {
  actions: PendingAction[]
  isLoading: boolean
  error: Error | null
}

export function usePendingActions(): UsePendingActionsReturn {
  const [actions, setActions] = useState<PendingAction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setIsLoading(true)
        const data = await getPendingActions()
        setActions(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch actions'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchActions()
  }, [])

  return { actions, isLoading, error }
}
