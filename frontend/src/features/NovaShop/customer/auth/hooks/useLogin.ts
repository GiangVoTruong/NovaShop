import { getApiErrorMessage, setTokens } from '@/lib/axios/instances'
import type { AuthLoginRequest } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { login } from '../services/loginService'

export default function useLogin() {
  const { t } = useTranslation()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: (request: AuthLoginRequest) => login(request),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken)
    },
    onError: (error) => {
      message.error(getApiErrorMessage(error, t('common.error')))
    },
  })
}
