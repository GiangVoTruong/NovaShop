import { getApiErrorMessage } from '@/lib/axios/instances'
import { Alert, Button } from 'antd'
import { useTranslation } from 'react-i18next'

type CatalogLoadErrorAlertProps = {
  error: unknown
  onRetry: () => void
  isRetrying?: boolean
}

export default function CatalogLoadErrorAlert({
  error,
  onRetry,
  isRetrying = false,
}: CatalogLoadErrorAlertProps) {
  const { t: translate } = useTranslation()
  const detail = getApiErrorMessage(error, translate('common.apiTimeout'))

  return (
    <Alert
      type="warning"
      showIcon
      message={translate('common.apiTimeout')}
      description={detail}
      action={
        <Button size="small" loading={isRetrying} onClick={onRetry}>
          {translate('common.retry')}
        </Button>
      }
      className="rounded-2xl"
    />
  )
}
