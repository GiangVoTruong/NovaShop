import { PATHS } from '@/router/paths'
import { message } from 'antd'
import { CreditCard, MapPin, Pencil, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CUSTOMERS } from '../../../shared/data/customers'
import Button from '../../../shared/ui/Button'
import { cx } from '../../../shared/ui/cx'
import { PROFILE_TABS } from '../constants/profile.constants'

export default function ProfilePage() {
  const { t } = useTranslation()
  const profile = CUSTOMERS[0]
  const [tab, setTab] = useState<string>('profile')

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 xl:px-14">
      <header className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-8 text-white shadow-[0_30px_60px_-15px_rgba(168,85,247,0.4)]">
        <div className="absolute -right-10 -top-10 size-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-80 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative flex flex-wrap items-center gap-5">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="size-20 rounded-3xl object-cover ring-4 ring-white/40"
          />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
              {t('profile.memberBadge')}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {t('profile.greeting', { name: profile.name })}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {t('profile.meta', {
                orders: profile.totalOrders,
                joinedAt: profile.joinedAt,
              })}
            </p>
          </div>
          <Button variant="white" leftIcon={<Pencil className="size-4" />}>
            {t('profile.edit')}
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/60 bg-white/85 p-3 backdrop-blur-xl lg:sticky lg:top-24 lg:self-start">
          <nav className="flex flex-row overflow-x-auto lg:flex-col">
            {PROFILE_TABS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                className={cx(
                  'flex items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-bold transition-colors',
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
                {t(entry.labelKey)}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {tab === 'profile' && <ProfileForm profile={profile} />}
          {tab === 'orders' && (
            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-extrabold tracking-tight">
                {t('profile.ordersTab.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {t('profile.ordersTab.descriptionPrefix')}{' '}
                <Link to={PATHS.ORDERS} className="font-bold text-fuchsia-600 hover:underline">
                  {t('profile.ordersTab.ordersLink')}
                </Link>
                .
              </p>
            </div>
          )}
          {tab === 'wishlist' && (
            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-extrabold tracking-tight">
                {t('profile.wishlistTab.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {t('profile.wishlistTab.descriptionPrefix')}{' '}
                <Link to={PATHS.WISHLIST} className="font-bold text-fuchsia-600 hover:underline">
                  {t('profile.wishlistTab.wishlistLink')}
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
  const { t } = useTranslation()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        message.success(t('profile.form.success'))
      }}
      className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl"
    >
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
        {t('profile.form.title')}
      </h2>
      <p className="text-sm text-slate-500">{t('profile.form.subtitle')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { labelKey: 'profile.form.fullName', value: profile.name },
          { labelKey: 'profile.form.email', value: profile.email },
          { labelKey: 'profile.form.phone', value: profile.phone },
          { labelKey: 'profile.form.joinedAt', value: profile.joinedAt },
        ].map((field) => (
          <div key={field.labelKey}>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">{t(field.labelKey)}</p>
            <input
              defaultValue={field.value}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-6" glow>
        {t('profile.form.save')}
      </Button>
    </form>
  )
}

function AddressSection() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {t('profile.address.title')}
        </h2>
        <Button glow>{t('profile.address.add')}</Button>
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
          className="flex items-start justify-between gap-4 rounded-3xl border border-white/60 bg-white/85 p-5 backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <MapPin className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{t(entry.nameKey)}</p>
                {entry.default && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    {t('profile.address.default')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{entry.address}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {t('profile.address.edit')}
          </Button>
        </article>
      ))}
    </div>
  )
}

function PaymentSection() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {t('profile.payment.title')}
        </h2>
        <Button glow>{t('profile.payment.add')}</Button>
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
          className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3">
            <span
              className={cx(
                'grid size-12 place-items-center rounded-2xl text-white shadow-md',
                `bg-linear-to-br ${card.grad}`,
              )}
            >
              <CreditCard className="size-5" />
            </span>
            <div>
              <p className="font-mono font-bold text-slate-900">
                {card.brand} •••• {card.last4}
              </p>
              <p className="text-sm text-slate-500">{card.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            {t('profile.payment.delete')}
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
  const { t } = useTranslation()

  return (
    <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
        {t('profile.notifications.title')}
      </h2>
      <ul className="mt-4 space-y-3">
        {NOTIFICATION_ITEM_KEYS.map((labelKey) => (
          <li
            key={labelKey}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <span className="text-sm text-slate-700">{t(labelKey)}</span>
            <input type="checkbox" defaultChecked className="size-5 accent-fuchsia-600" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SecuritySection() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="font-bold text-slate-900">{t('profile.security.twoFactorTitle')}</p>
            <p className="text-sm text-slate-600">{t('profile.security.twoFactorDesc')}</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {t('profile.security.changePassword')}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            type="password"
            placeholder={t('profile.security.currentPassword')}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder={t('profile.security.newPassword')}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
        </div>
        <Button className="mt-4" glow>
          {t('profile.security.updatePassword')}
        </Button>
      </div>
    </div>
  )
}
