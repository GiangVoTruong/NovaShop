import { usePublicSettings } from '@/features/NovaShop/shared/hooks/usePublicSettings'
import { PATHS } from '@/router/paths'
import { Spin } from 'antd'
import { Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

export default function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { t: translate } = useTranslation()
  const location = useLocation()
  const settingsQuery = usePublicSettings()

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  const settings = settingsQuery.data
  const isAuthRoute = location.pathname.startsWith('/auth')

  if (!settings?.maintenanceMode || isAuthRoute) {
    return children
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="mb-6 grid size-16 place-items-center rounded-3xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white shadow-lg">
        <Wrench className="size-8" />
      </span>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
        {translate('maintenance.title')}
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-500">{translate('maintenance.description')}</p>
      {(settings.supportEmail || settings.supportPhone) && (
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-4 text-sm text-slate-600">
          {settings.supportEmail ? (
            <p>
              {translate('maintenance.supportEmail')}:{' '}
              <a href={`mailto:${settings.supportEmail}`} className="font-semibold text-fuchsia-600">
                {settings.supportEmail}
              </a>
            </p>
          ) : null}
          {settings.supportPhone ? (
            <p className={settings.supportEmail ? 'mt-1' : undefined}>
              {translate('maintenance.supportPhone')}:{' '}
              <a href={`tel:${settings.supportPhone}`} className="font-semibold text-fuchsia-600">
                {settings.supportPhone}
              </a>
            </p>
          ) : null}
        </div>
      )}
      <Link
        to={PATHS.LOGIN}
        className="mt-8 text-sm font-semibold text-fuchsia-600 hover:underline"
      >
        {translate('maintenance.adminLogin')}
      </Link>
    </div>
  )
}
