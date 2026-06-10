import { useMutation } from '@tanstack/react-query'
import authService from '../services/authService'
import type { AuthResetPasswordRequest } from '@/types/auth.types'

export function useResetPassword() {
  return useMutation({
    mutationKey: ['auth', 'reset-password'],
    mutationFn: (request: AuthResetPasswordRequest) => authService.resetPassword(request),
  })
}
