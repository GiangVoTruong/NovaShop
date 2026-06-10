import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import settingsService from '../services/settingsService'

export const PUBLIC_SETTINGS_QUERY_KEY = ['settings', 'public'] as const

export function usePublicSettings() {
  return useQuery({
    queryKey: PUBLIC_SETTINGS_QUERY_KEY,
    queryFn: settingsService.getPublicSettings,
    staleTime: 60_000,
  })
}
