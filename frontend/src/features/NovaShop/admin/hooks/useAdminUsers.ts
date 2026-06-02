import { useQuery } from '@tanstack/react-query'
import adminUserService from '../services/adminUserService'

export const ADMIN_USERS_QUERY_KEY = ['admin', 'users'] as const

export function useAdminUsers() {
  return useQuery({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: adminUserService.getAll,
  })
}
