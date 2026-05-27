import { getApiErrorMessage } from '@/lib/axios/instances'
import { useMutation } from '@tanstack/react-query'
import { message } from 'antd'
import { useTranslation } from 'react-i18next'
import authService from '../services/authService'

export default function useRegister() {
  const { t: translate } = useTranslation()

  return useMutation({
    mutationKey: ['register'],
    mutationFn: authService.register,
    onError: (error) => {
      message.error(getApiErrorMessage(error, translate('common.error')))
    },
  })
}
