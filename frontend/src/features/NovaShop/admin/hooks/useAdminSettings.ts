import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ShopSettings } from '@/types/admin.types'
import adminSettingsService from '../services/adminSettingsService'

export const ADMIN_SETTINGS_QUERY_KEY = ['admin', 'settings'] as const

export function useAdminSettings() {
  return useQuery({
    queryKey: ADMIN_SETTINGS_QUERY_KEY,
    queryFn: adminSettingsService.getSettings,
  })
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['admin', 'settings', 'update'],
    mutationFn: (settings: ShopSettings) => adminSettingsService.updateSettings(settings),
    onSuccess: async (settings) => {
      queryClient.setQueryData(ADMIN_SETTINGS_QUERY_KEY, settings)
    },
  })
}
