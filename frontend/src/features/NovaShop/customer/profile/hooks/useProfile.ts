import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import authService from '@/features/NovaShop/customer/auth/services/authService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ChangePasswordRequest, UpdateUserProfileRequest } from '@/types/auth.types'
import notificationService from '../services/notificationService'

const AUTH_ME_QUERY_KEY = ['auth', 'me'] as const
export const NOTIFICATION_PREFS_QUERY_KEY = ['notifications', 'preferences'] as const

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['profile', 'update'],
    mutationFn: (request: UpdateUserProfileRequest) => authService.updateMe(request),
    onSuccess: async (profile) => {
      queryClient.setQueryData(AUTH_ME_QUERY_KEY, profile)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationKey: ['profile', 'change-password'],
    mutationFn: (request: ChangePasswordRequest) => authService.changePassword(request),
  })
}

export function useNotificationPreferences() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: NOTIFICATION_PREFS_QUERY_KEY,
    queryFn: notificationService.getPreferences,
    enabled: isAuthenticated,
    staleTime: Infinity,
    refetchOnMount: false,
  })
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['notifications', 'update'],
    mutationFn: notificationService.updatePreferences,
    onSuccess: async (preferences) => {
      queryClient.setQueryData(NOTIFICATION_PREFS_QUERY_KEY, preferences)
    },
  })
}
