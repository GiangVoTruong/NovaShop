import enUS from 'antd/locale/en_US'
import viVN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/vi'

import type { AppLanguage } from '@/lib/i18n/types'

export function getAntdLocale(language: string) {
  return language === 'en' ? enUS : viVN
}

export function syncDayjsLocale(language: string): void {
  dayjs.locale(language === 'en' ? 'en' : 'vi')
}

export function isAppLanguage(value: string): value is AppLanguage {
  return value === 'vi' || value === 'en'
}
