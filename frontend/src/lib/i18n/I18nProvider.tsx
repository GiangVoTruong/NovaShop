import { ConfigProvider } from 'antd'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { antdTheme } from '@/lib/antd/theme'
import { getAntdLocale, syncDayjsLocale } from '@/lib/i18n/antdLocale'

interface I18nProviderProps {
  children: ReactNode
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation()

  useEffect(() => {
    syncDayjsLocale(i18n.language)
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <ConfigProvider locale={getAntdLocale(i18n.language)} theme={antdTheme}>
      {children}
    </ConfigProvider>
  )
}
