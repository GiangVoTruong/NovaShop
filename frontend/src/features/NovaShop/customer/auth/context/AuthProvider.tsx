import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import authService from '@/features/NovaShop/customer/auth/services/authService'
import {
  clearTokens,
  hasAccessToken,
  setTokens,
  subscribeAccessToken,
} from '@/lib/axios/instances'
import type { UserProfile } from '@/types/auth.types'
import { AuthContext, type AuthContextValue, type LoginSessionInput } from './authContext'

const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const

async function fetchCurrentUser(): Promise<UserProfile> {
  try {
    return await authService.getMe()
  } catch (error) {
    clearTokens()
    console.error('[AuthProvider] getMe failed:', error)
    throw error
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const tokenPresent = useSyncExternalStore(subscribeAccessToken, hasAccessToken, () => false)

  const profileQuery = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: fetchCurrentUser,
    enabled: tokenPresent,
    retry: false,
    staleTime: 5 * 60_000,
  })

  const user = profileQuery.data ?? null
  const isBootstrapping =
    tokenPresent && !user && (profileQuery.isPending || profileQuery.isFetching)

  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!hasAccessToken()) {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
      return null
    }

    try {
      return await queryClient.fetchQuery({
        queryKey: AUTH_ME_QUERY_KEY,
        queryFn: fetchCurrentUser,
      })
    } catch {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
      return null
    }
  }, [queryClient])

  const loginSession = useCallback(
    async ({ accessToken, refreshToken }: LoginSessionInput) => {
      queryClient.removeQueries({ queryKey: ['notification-inbox'] })
      setTokens(accessToken, refreshToken)
      await refreshProfile()
    },
    [refreshProfile, queryClient],
  )

  const logout = useCallback(() => {
    clearTokens()
    queryClient.setQueryData(AUTH_ME_QUERY_KEY, null)
    queryClient.removeQueries({ queryKey: ['cart'] })
    queryClient.removeQueries({ queryKey: ['orders'] })
    queryClient.removeQueries({ queryKey: ['wishlist'] })
    queryClient.removeQueries({ queryKey: ['addresses'] })
    queryClient.removeQueries({ queryKey: ['notification-inbox'] })
    queryClient.removeQueries({ queryKey: ['notifications', 'preferences'] })
  }, [queryClient])

  useEffect(() => {
    if (!tokenPresent || user || profileQuery.isFetching) {
      return
    }
    void refreshProfile()
  }, [tokenPresent, user, profileQuery.isFetching, refreshProfile])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      loginSession,
      logout,
      refreshProfile,
    }),
    [user, isBootstrapping, loginSession, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
