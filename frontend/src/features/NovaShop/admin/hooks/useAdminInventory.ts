import { useQuery } from '@tanstack/react-query'
import type { AdminInventoryListParams } from '@/types/admin.types'
import adminInventoryService from '../services/adminInventoryService'

export const ADMIN_INVENTORY_QUERY_KEY = ['admin', 'inventory'] as const

export function useAdminInventory(params: AdminInventoryListParams = {}) {
  return useQuery({
    queryKey: [...ADMIN_INVENTORY_QUERY_KEY, params],
    queryFn: () => adminInventoryService.listInventory(params),
  })
}

export function useAdminInventorySummary() {
  return useQuery({
    queryKey: [...ADMIN_INVENTORY_QUERY_KEY, 'summary'],
    queryFn: adminInventoryService.getSummary,
  })
}
