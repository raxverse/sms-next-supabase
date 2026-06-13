'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { getUserProfile } from '@/lib/profileService'
import { AuthService } from '@/lib/authService'
import { AuthorizationService } from '@/lib/authorizationService'
import type { AuthUser, RoleType, Resource, Action, UserProfile } from '@/types/rbac'

interface AuthContextType {
  // Basic auth
  user: User | null
  profile: UserProfile | null

  // RBAC
  authUser: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Role checks
  hasRole: (role: RoleType | RoleType[]) => boolean
  hasAnyRole: (roles: RoleType[]) => boolean
  hasAllRoles: (roles: RoleType[]) => boolean

  // Permission checks
  hasPermission: (resource: Resource, action: Action) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean

  // School context
  canAccessSchool: (schoolId: string) => boolean

  // Utilities
  refreshRoles: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user with RBAC context
  const fetchUserWithRBAC = useCallback(async (userId: string) => {
    try {
      setError(null)

      // Get basic profile
      const userProfile = await getUserProfile(userId)
      if (!userProfile) {
        setProfile(null)
        setAuthUser(null)
        return
      }

      setProfile(userProfile)

      // Build auth user with RBAC context
      const fullAuthUser = await AuthorizationService.buildAuthUser(userProfile)
      setAuthUser(fullAuthUser)

      // Update last login
      await AuthService.updateLastLogin(userId)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error fetching user context'
      console.error('Error fetching user with RBAC:', err)
      setError(errorMsg)
      setProfile(null)
      setAuthUser(null)
    }
  }, [])

  // Initialize session
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        const currentUser = data.session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          await fetchUserWithRBAC(currentUser.id)
        } else {
          setProfile(null)
          setAuthUser(null)
        }
      } catch (err) {
        console.error('Error getting session:', err)
        setError('Failed to get session')
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchUserWithRBAC(currentUser.id)
        }
      } else {
        setProfile(null)
        setAuthUser(null)
        setError(null)
      }
    })

    return () => {
      if (listener?.subscription?.unsubscribe) {
        listener.subscription.unsubscribe()
      }
    }
  }, [fetchUserWithRBAC])

  // Refresh roles and permissions
  const refreshRoles = useCallback(async () => {
    if (!user) return

    try {
      setError(null)
      await fetchUserWithRBAC(user.id)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error refreshing roles'
      console.error('Error refreshing roles:', err)
      setError(errorMsg)
    }
  }, [user, fetchUserWithRBAC])

  // Logout
  const logout = useCallback(async () => {
    try {
      setError(null)
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setAuthUser(null)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error logging out'
      console.error('Error logging out:', err)
      setError(errorMsg)
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) throw new Error('No user authenticated')

      try {
        setError(null)
        await AuthService.updateUserProfile(user.id, updates)
        await fetchUserWithRBAC(user.id)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error updating profile'
        console.error('Error updating profile:', err)
        setError(errorMsg)
        throw err
      }
    },
    [user, fetchUserWithRBAC]
  )

  // Role checks
  const hasRole = useCallback(
    (role: RoleType | RoleType[]) => {
      if (!authUser) return false
      if (typeof role === 'string') {
        return AuthorizationService.hasRole(authUser, role)
      }
      return AuthorizationService.hasAnyRole(authUser, role)
    },
    [authUser]
  )

  const hasAnyRole = useCallback(
    (roles: RoleType[]) => {
      if (!authUser) return false
      return AuthorizationService.hasAnyRole(authUser, roles)
    },
    [authUser]
  )

  const hasAllRoles = useCallback(
    (roles: RoleType[]) => {
      if (!authUser) return false
      return AuthorizationService.hasAllRoles(authUser, roles)
    },
    [authUser]
  )

  // Permission checks
  const hasPermission = useCallback(
    (resource: Resource, action: Action) => {
      if (!authUser) return false
      return AuthorizationService.hasPermission(authUser, resource, action)
    },
    [authUser]
  )

  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      if (!authUser) return false
      return AuthorizationService.hasAnyPermission(authUser, permissions)
    },
    [authUser]
  )

  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      if (!authUser) return false
      return AuthorizationService.hasAllPermissions(authUser, permissions)
    },
    [authUser]
  )

  // School access check
  const canAccessSchool = useCallback(
    (schoolId: string) => {
      if (!authUser) return false
      return AuthorizationService.canAccessSchool(authUser, schoolId)
    },
    [authUser]
  )

  const value: AuthContextType = {
    user,
    profile,
    authUser,
    isLoading,
    isAuthenticated: !!user && profile?.is_active !== false,
    error,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessSchool,
    refreshRoles,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}