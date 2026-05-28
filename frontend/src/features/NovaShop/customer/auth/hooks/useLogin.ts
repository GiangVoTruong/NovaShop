import type { AuthLoginResponse } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { getApiErrorMessage } from '@/lib/axios/instances'
import { isEmailNotVerifiedError } from '../lib/authErrors'
import authService from '../services/authService'
import { useAuth } from './useAuth'

export default function useLogin() {
  const { t: translate } = useTranslation()
  const { loginSession } = useAuth()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: authService.login,
    onSuccess: async (data: AuthLoginResponse) => {
      await loginSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      })
    },
    onError: (error) => {
      if (isEmailNotVerifiedError(error)) {
        return
      }
      message.error(getApiErrorMessage(error, translate('common.error')))
    },
  })
}
