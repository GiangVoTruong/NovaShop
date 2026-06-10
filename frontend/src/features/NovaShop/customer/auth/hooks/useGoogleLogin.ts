import { getApiErrorMessage } from '@/lib/axios/instances'
import { PATHS } from '@/router/paths'
import type { AuthGoogleRequest, AuthLoginResponse } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useAuth } from './useAuth'

export default function useGoogleLogin() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { loginSession } = useAuth()

  const mutation = useMutation({
    mutationKey: ['auth', 'google'],
    mutationFn: async (request: AuthGoogleRequest): Promise<AuthLoginResponse> => {
      const data = await authService.loginWithGoogle(request)
      await loginSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      return data
    },
    onError: (error) => {
      message.error(getApiErrorMessage(error, translate('auth.googleLoginFailed')))
    },
  })

  const loginWithGoogle = (idToken: string) => {
    mutation.mutate(
      { idToken },
      {
        onSuccess: (data) => {
          message.success(translate('auth.loginSuccess'))
          navigate(data.role === 'ADMIN' && data.portalType === 'ADMIN' ? PATHS.ADMIN : PATHS.HOME, {
            replace: true,
          })
        },
      },
    )
  }

  return {
    loginWithGoogle,
    isPending: mutation.isPending,
  }
}
