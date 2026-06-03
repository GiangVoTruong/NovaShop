import { getApiErrorMessage } from '@/lib/axios/instances'
import { PATHS } from '@/router/paths'
import type { AuthLoginRequest, AuthLoginResponse } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { isEmailNotVerifiedError } from '../lib/authErrors'
import authService from '../services/authService'
import { useAuth } from './useAuth'

export default function useLogin() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { loginSession } = useAuth()

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (request: AuthLoginRequest): Promise<AuthLoginResponse> => {
      const data = await authService.login(request)
      await loginSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
      return data
    },
    onError: (error) => {
      if (isEmailNotVerifiedError(error)) {
        return
      }
      message.error(getApiErrorMessage(error, translate('common.error')))
    },
  })

  const login = async (email: string, password: string) => {
    try {
      const data = await mutation.mutateAsync({ email, password })
      message.success(translate('auth.loginSuccess'))
      navigate(data.role === 'ADMIN' && data.portalType === 'ADMIN' ? PATHS.ADMIN : PATHS.HOME, {
        replace: true,
      })
    } catch (error) {
      if (!isEmailNotVerifiedError(error)) {
        return
      }

      message.info(translate('auth.verificationEmailResent'))
      navigate(PATHS.VERIFY_EMAIL, {
        replace: true,
        state: { email, fromLogin: true },
      })
    }
  }

  return {
    login,
    isPending: mutation.isPending,
  }
}
