import { useMutation } from '@tanstack/react-query'
import authService from '../services/authService'
import type { AuthForgotPasswordRequest } from '@/types/auth.types'

export function useForgotPassword() {
  return useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: (request: AuthForgotPasswordRequest) => authService.forgotPassword(request),
  })
}
