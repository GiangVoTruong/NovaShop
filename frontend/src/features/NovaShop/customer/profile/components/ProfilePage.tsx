import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { CUSTOMERS } from '@/features/NovaShop/shared/data/customers'
import Button from '@/features/NovaShop/shared/ui/Button'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { PATHS } from '@/router/paths'
import { message } from 'antd'
import { CreditCard, LogOut, MapPin, Pencil, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { PROFILE_TABS } from '../constants/profile.constants'

export default function ProfilePage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const profile = CUSTOMERS[0]
  const [tab, setTab] = useState<string>('profile')

  const handleLogout = () => {
    logout()
    navigate(PATHS.HOME)
  }

  const displayName = user?.fullName ?? profile.name

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14">
      <header className="relative mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-5 text-white shadow-[0_30px_60px_-15px_rgba(168,85,247,0.4)] sm:mb-8 sm:p-8">
        <div className="absolute -right-10 -top-10 size-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-80 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative flex min-w-0 flex-wrap items-center gap-4 sm:gap-5">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="size-16 shrink-0 rounded-3xl object-cover ring-4 ring-white/40 sm:size-20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
              {translate('profile.memberBadge')}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {translate('profile.greeting', { name: displayName })}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {translate('profile.meta', {
                orders: profile.totalOrders,
                joinedAt: profile.joinedAt,
              })}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="white"
              leftIcon={<Pencil className="size-4" />}
              className="w-full sm:w-auto"
            >
              {translate('profile.edit')}
            </Button>
            <Button
              type="button"
              variant="white"
              leftIcon={<LogOut className="size-4" />}
              className="w-full text-rose-600 sm:w-auto"
              onClick={handleLogout}
            >
              {translate('auth.logout')}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid w-full min-w-0 gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="min-w-0 max-w-full overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-2 backdrop-blur-xl sm:p-3 lg:sticky lg:top-24 lg:self-start">
          <nav className="flex gap-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {PROFILE_TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                className={cx(
                  'flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors sm:gap-3 sm:px-4 sm:py-3 lg:shrink lg:whitespace-normal',
                  tab === entry.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100',
                )}
              >
                <span
                  className={cx(
                    'grid size-7 place-items-center rounded-lg text-white',
                    `bg-linear-to-br ${entry.grad}`,
                  )}
                >
                  <entry.icon className="size-3.5" />
                </span>
                {translate(entry.labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 w-full">
          {tab === 'profile' && <ProfileForm profile={profile} />}
          {tab === 'orders' && (
            <div className="min-w-0 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6">
              <h2 className="text-xl font-extrabold tracking-tight">
                {translate('profile.ordersTab.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {translate('profile.ordersTab.descriptionPrefix')}{' '}
                <Link to={PATHS.ORDERS} className="font-bold text-fuchsia-600 hover:underline">
                  {translate('profile.ordersTab.ordersLink')}
                </Link>
                .
              </p>
            </div>
          )}
          {tab === 'wishlist' && (
            <div className="min-w-0 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6">
              <h2 className="text-xl font-extrabold tracking-tight">
                {translate('profile.wishlistTab.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {translate('profile.wishlistTab.descriptionPrefix')}{' '}
                <Link to={PATHS.WISHLIST} className="font-bold text-fuchsia-600 hover:underline">
                  {translate('profile.wishlistTab.wishlistLink')}
                </Link>
                .
              </p>
            </div>
          )}
          {tab === 'address' && <AddressSection />}
          {tab === 'payment' && <PaymentSection />}
          {tab === 'notifications' && <NotificationSection />}
          {tab === 'security' && <SecuritySection />}
        </div>
      </div>
    </div>
  )
}

function ProfileForm({ profile }: { profile: (typeof CUSTOMERS)[number] }) {
  const { t: translate } = useTranslation()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        message.success(translate('profile.form.success'))
      }}
      className="min-w-0 w-full rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6"
    >
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
        {translate('profile.form.title')}
      </h2>
      <p className="text-sm text-slate-500">{translate('profile.form.subtitle')}</p>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { labelKey: 'profile.form.fullName', value: profile.name },
          { labelKey: 'profile.form.email', value: profile.email },
          { labelKey: 'profile.form.phone', value: profile.phone },
          { labelKey: 'profile.form.joinedAt', value: profile.joinedAt },
        ].map((field) => (
          <div key={field.labelKey} className="min-w-0">
            <p className="mb-1.5 text-sm font-semibold text-slate-700">
              {translate(field.labelKey)}
            </p>
            <input
              defaultValue={field.value}
              className="box-border h-11 w-full min-w-0 max-w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-6 w-full sm:w-auto" glow>
        {translate('profile.form.save')}
      </Button>
    </form>
  )
}

function AddressSection() {
  const { t: translate } = useTranslation()

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {translate('profile.address.title')}
        </h2>
        <Button glow>{translate('profile.address.add')}</Button>
      </div>
      {[
        {
          nameKey: 'profile.address.entries.home',
          address: '12 Nguyễn Huệ, P. Bến Nghé, Q.1, TP. HCM',
          default: true,
        },
        {
          nameKey: 'profile.address.entries.office',
          address: '88 Nguyễn Văn Trỗi, Q. Phú Nhuận, TP. HCM',
          default: false,
        },
      ].map((entry) => (
        <article
          key={entry.nameKey}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{translate(entry.nameKey)}</p>
                {entry.default && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    {translate('profile.address.default')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{entry.address}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {translate('profile.address.edit')}
          </Button>
        </article>
      ))}
    </div>
  )
}

function PaymentSection() {
  const { t: translate } = useTranslation()

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {translate('profile.payment.title')}
        </h2>
        <Button glow>{translate('profile.payment.add')}</Button>
      </div>
      {[
        {
          brand: 'Visa',
          last4: '4242',
          name: 'Nguyen Minh Anh',
          grad: 'from-blue-500 to-indigo-600',
        },
        {
          brand: 'Mastercard',
          last4: '1010',
          name: 'Nguyen Minh Anh',
          grad: 'from-orange-500 to-red-500',
        },
      ].map((card) => (
        <article
          key={card.last4}
          className="relative flex min-w-0 flex-col gap-4 overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cx(
                'grid size-12 place-items-center rounded-2xl text-white shadow-md',
                `bg-linear-to-br ${card.grad}`,
              )}
            >
              <CreditCard className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-mono font-bold text-slate-900">
                {card.brand} •••• {card.last4}
              </p>
              <p className="text-sm text-slate-500">{card.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {translate('profile.payment.delete')}
          </Button>
        </article>
      ))}
    </div>
  )
}

const NOTIFICATION_ITEM_KEYS = [
  'profile.notifications.items.orderEmail',
  'profile.notifications.items.promoEmail',
  'profile.notifications.items.securitySms',
  'profile.notifications.items.deliveryPush',
] as const

function NotificationSection() {
  const { t: translate } = useTranslation()

  return (
    <div className="min-w-0 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
        {translate('profile.notifications.title')}
      </h2>
      <ul className="mt-4 space-y-3">
        {NOTIFICATION_ITEM_KEYS.map((labelKey) => (
          <li
            key={labelKey}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <span className="min-w-0 text-sm text-slate-700">{translate(labelKey)}</span>
            <input type="checkbox" defaultChecked className="size-5 accent-fuchsia-600" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SecuritySection() {
  const { t: translate } = useTranslation()

  return (
    <div className="min-w-0 space-y-4">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-slate-900">
              {translate('profile.security.twoFactorTitle')}
            </p>
            <p className="text-sm text-slate-600">{translate('profile.security.twoFactorDesc')}</p>
          </div>
        </div>
      </div>
      <div className="min-w-0 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          {translate('profile.security.changePassword')}
        </h2>
        <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="password"
            placeholder={translate('profile.security.currentPassword')}
            className="box-border h-11 w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder={translate('profile.security.newPassword')}
            className="box-border h-11 w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
        </div>
        <Button className="mt-4 w-full sm:w-auto" glow>
          {translate('profile.security.updatePassword')}
        </Button>
      </div>
    </div>
  )
}
