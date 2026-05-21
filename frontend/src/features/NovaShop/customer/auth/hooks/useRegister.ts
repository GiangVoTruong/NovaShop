import { getApiErrorMessage } from '@/lib/axios/instances'
import type { AuthRegisterRequest } from '@/types/auth.types'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import { register } from '../services/registerService'

export default function useRegister() {
  const { t } = useTranslation()

  return useMutation({
    mutationKey: ['register'],
    mutationFn: (request: AuthRegisterRequest) => register(request),
    onError: (error) => {
      message.error(getApiErrorMessage(error, t('common.error')))
    },
  })
}
