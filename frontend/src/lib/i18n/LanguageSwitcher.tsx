import type { MenuProps } from 'antd'
import { Dropdown } from 'antd'
import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cx } from '@/features/NovaShop/shared/ui/cx'
import { isAppLanguage } from '@/lib/i18n/antdLocale'
import type { AppLanguage } from '@/lib/i18n/types'

const LANGUAGE_OPTIONS: { value: AppLanguage; label: string }[] = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]

interface LanguageSwitcherProps {
  className?: string
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { i18n, t: translate } = useTranslation()

  const currentLanguage = isAppLanguage(i18n.language) ? i18n.language : 'vi'

  const menuItems: MenuProps['items'] = LANGUAGE_OPTIONS.map((option) => ({
    key: option.value,
    label: option.label,
  }))

  return (
    <Dropdown
      menu={{
        items: menuItems,
        selectedKeys: [currentLanguage],
        onClick: ({ key }) => {
          if (isAppLanguage(key)) {
            void i18n.changeLanguage(key)
          }
        },
      }}
      trigger={['click']}
      placement="bottomRight"
    >
      <button
        type="button"
        className={cx(
          'grid size-10 shrink-0 place-items-center text-slate-700 transition-colors hover:border-fuchsia-300 hover:text-fuchsia-600',
          className,
        )}
        aria-label={translate('common.language')}
      >
        <Globe className="size-5" />
      </button>
    </Dropdown>
  )
}
