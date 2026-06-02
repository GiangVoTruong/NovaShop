import { useAuth } from '@/features/NovaShop/customer/auth/hooks/useAuth'
import { useOrders } from '@/features/NovaShop/customer/orders/hooks/useOrders'
import { formatDate } from '@/features/NovaShop/shared/format'
import Button from '@/features/NovaShop/shared/ui/Button'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { PATHS } from '@/router/paths'
import type { ApiAddressResponse } from '@/types/address.types'
import type { UserProfile } from '@/types/auth.types'
import type { NotificationPreferences } from '@/types/notification.types'
import { Form, Input, Modal, Spin, Switch, message } from 'antd'
import type { FormProps } from 'antd'
import { LogOut, MapPin, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { PROFILE_TABS } from '../constants/profile.constants'
import {
  useAddresses,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../hooks/useAddresses'
import {
  useChangePassword,
  useNotificationPreferences,
  useUpdateNotificationPreferences,
  useUpdateProfile,
} from '../hooks/useProfile'
import { formatAddressLine, getAddressLabel } from '../lib/addressApi'
import AddressFormModal from './AddressFormModal'

type ProfileFormValues = {
  fullName: string
  phone: string
}

type ChangePasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ProfilePage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const ordersQuery = useOrders()
  const [tab, setTab] = useState<string>('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const handleLogout = () => {
    logout()
    navigate(PATHS.HOME)
  }

  if (!user) {
    return null
  }

  const orderCount = ordersQuery.data?.length ?? 0
  const joinedAt = formatDate(user.createdAt)

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 xl:px-14">
      <header className="relative mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-5 text-white shadow-[0_30px_60px_-15px_rgba(168,85,247,0.4)] sm:mb-8 sm:p-8">
        <div className="absolute -right-10 -top-10 size-72 rounded-full bg-pink-300/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-80 rounded-full bg-cyan-300/30 blur-3xl" />

        <div className="relative flex min-w-0 flex-wrap items-center gap-4 sm:gap-5">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="size-16 shrink-0 rounded-3xl object-cover ring-4 ring-white/40 sm:size-20"
            />
          ) : (
            <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-white/20 text-lg font-bold text-white ring-4 ring-white/40 sm:size-20 sm:text-xl">
              {getProfileInitials(user.fullName)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70">
              {translate('profile.memberBadge')}
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {translate('profile.greeting', { name: user.fullName })}
            </h1>
            <p className="mt-1 text-sm text-white/80">
              {translate('profile.meta', {
                orders: orderCount,
                joinedAt,
              })}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button
              variant="white"
              leftIcon={<Pencil className="size-4" />}
              className="w-full sm:w-auto"
              onClick={() => {
                setTab('profile')
                setIsEditingProfile((value) => !value)
              }}
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
          {tab === 'profile' && (
            <ProfileForm
              user={user}
              joinedAt={joinedAt}
              isEditing={isEditingProfile}
              onSaved={() => setIsEditingProfile(false)}
            />
          )}
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

function ProfileForm({
  user,
  joinedAt,
  isEditing,
  onSaved,
}: {
  user: UserProfile
  joinedAt: string
  isEditing: boolean
  onSaved: () => void
}) {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<ProfileFormValues>()
  const updateMutation = useUpdateProfile()

  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
    })
  }, [user, form])

  const handleSubmit: FormProps<ProfileFormValues>['onFinish'] = (values) => {
    updateMutation.mutate(values, {
      onSuccess: () => {
        message.success(translate('profile.form.success'))
        onSaved()
      },
      onError: () => message.error(translate('profile.form.error')),
    })
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      className="min-w-0 w-full rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6"
    >
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
        {translate('profile.form.title')}
      </h2>
      <p className="text-sm text-slate-500">
        {isEditing ? translate('profile.form.subtitle') : translate('profile.form.viewHint')}
      </p>

      <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <Form.Item
          name="fullName"
          label={translate('profile.form.fullName')}
          rules={[{ required: true, message: translate('profile.form.required') }]}
        >
          <Input readOnly={!isEditing} className={!isEditing ? 'bg-slate-50' : undefined} />
        </Form.Item>
        <Form.Item label={translate('profile.form.email')}>
          <Input readOnly value={user.email} className="bg-slate-50" />
        </Form.Item>
        <Form.Item
          name="phone"
          label={translate('profile.form.phone')}
          rules={[
            { required: true, message: translate('profile.form.required') },
            {
              pattern: /^0[0-9]{9,10}$/,
              message: translate('profile.form.phoneInvalid'),
            },
          ]}
        >
          <Input readOnly={!isEditing} className={!isEditing ? 'bg-slate-50' : undefined} />
        </Form.Item>
        <Form.Item label={translate('profile.form.joinedAt')}>
          <Input readOnly value={joinedAt} className="bg-slate-50" />
        </Form.Item>
      </div>

      {isEditing && (
        <Button type="submit" glow loading={updateMutation.isPending} className="mt-2">
          {translate('profile.form.save')}
        </Button>
      )}
    </Form>
  )
}

function getProfileInitials(fullName: string): string {
  const nameParts = fullName.trim().split(/\s+/)
  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase()
  }

  const firstInitial = nameParts[0][0] ?? ''
  const lastInitial = nameParts[nameParts.length - 1][0] ?? ''
  return `${firstInitial}${lastInitial}`.toUpperCase()
}

function AddressSection() {
  const { t: translate } = useTranslation()
  const addressesQuery = useAddresses()
  const deleteMutation = useDeleteAddress()
  const setDefaultMutation = useSetDefaultAddress()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<ApiAddressResponse | null>(null)

  const openCreateModal = () => {
    setEditingAddress(null)
    setModalOpen(true)
  }

  const openEditModal = (address: ApiAddressResponse) => {
    setEditingAddress(address)
    setModalOpen(true)
  }

  const handleDelete = (address: ApiAddressResponse) => {
    Modal.confirm({
      title: translate('profile.address.deleteConfirm'),
      onOk: () => deleteMutation.mutateAsync(address.id),
    })
  }

  if (addressesQuery.isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const addresses = addressesQuery.data ?? []

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          {translate('profile.address.title')}
        </h2>
        <Button glow onClick={openCreateModal}>
          {translate('profile.address.add')}
        </Button>
      </div>

      {addresses.length === 0 && (
        <p className="rounded-3xl border border-dashed border-slate-200 bg-white/85 p-6 text-sm text-slate-500">
          {translate('profile.address.empty')}
        </p>
      )}

      {addresses.map((address) => (
        <article
          key={address.id}
          className="flex min-w-0 flex-col gap-4 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:flex-row sm:items-start sm:justify-between sm:p-5"
        >
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <MapPin className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-slate-900">{getAddressLabel(address)}</p>
                {address.isDefault && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    {translate('profile.address.default')}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{formatAddressLine(address)}</p>
              <p className="mt-1 text-xs text-slate-500">
                {address.recipientName} · {address.phone}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {!address.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                loading={setDefaultMutation.isPending}
                onClick={() => setDefaultMutation.mutate(address.id)}
              >
                {translate('profile.address.setDefault')}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => openEditModal(address)}>
              {translate('profile.address.edit')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600"
              loading={deleteMutation.isPending}
              onClick={() => handleDelete(address)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </article>
      ))}

      <AddressFormModal
        open={modalOpen}
        editingAddress={editingAddress}
        onClose={() => setModalOpen(false)}
      />
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
        <Button glow disabled>
          {translate('profile.payment.add')}
        </Button>
      </div>
      <p className="rounded-3xl border border-dashed border-slate-200 bg-white/85 p-6 text-sm text-slate-500">
        {translate('profile.payment.comingSoon')}
      </p>
    </div>
  )
}

const NOTIFICATION_KEYS = [
  { key: 'orderEmail' as const, labelKey: 'profile.notifications.items.orderEmail' },
  { key: 'promoEmail' as const, labelKey: 'profile.notifications.items.promoEmail' },
  { key: 'securitySms' as const, labelKey: 'profile.notifications.items.securitySms' },
  { key: 'deliveryPush' as const, labelKey: 'profile.notifications.items.deliveryPush' },
] as const

function NotificationSection() {
  const { t: translate } = useTranslation()
  const preferencesQuery = useNotificationPreferences()
  const updateMutation = useUpdateNotificationPreferences()

  if (preferencesQuery.isLoading || !preferencesQuery.data) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Spin />
      </div>
    )
  }

  const preferences = preferencesQuery.data

  const handleToggle = (key: keyof NotificationPreferences, checked: boolean) => {
    updateMutation.mutate(
      { ...preferences, [key]: checked },
      {
        onSuccess: () => message.success(translate('profile.notifications.saved')),
        onError: () => message.error(translate('profile.notifications.error')),
      },
    )
  }

  return (
    <div className="min-w-0 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
        {translate('profile.notifications.title')}
      </h2>
      <ul className="mt-4 space-y-3">
        {NOTIFICATION_KEYS.map((entry) => (
          <li
            key={entry.key}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <span className="min-w-0 text-sm text-slate-700">{translate(entry.labelKey)}</span>
            <Switch
              checked={preferences[entry.key]}
              loading={updateMutation.isPending}
              onChange={(checked) => handleToggle(entry.key, checked)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SecuritySection() {
  const { t: translate } = useTranslation()
  const [form] = Form.useForm<ChangePasswordFormValues>()
  const changePasswordMutation = useChangePassword()

  const handleSubmit: FormProps<ChangePasswordFormValues>['onFinish'] = (values) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        message.success(translate('profile.security.success'))
        form.resetFields()
      },
      onError: () => message.error(translate('profile.security.error')),
    })
  }

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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="min-w-0 rounded-3xl border border-white/60 bg-white/85 p-4 backdrop-blur-xl sm:p-6"
      >
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
          {translate('profile.security.changePassword')}
        </h2>
        <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item
            name="currentPassword"
            label={translate('profile.security.currentPassword')}
            rules={[{ required: true, message: translate('profile.form.required') }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label={translate('profile.security.newPassword')}
            rules={[
              { required: true, message: translate('profile.form.required') },
              { min: 8, message: translate('profile.security.passwordMin') },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label={translate('profile.security.confirmPassword')}
            dependencies={['newPassword']}
            rules={[
              { required: true, message: translate('profile.form.required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(translate('profile.security.passwordMismatch')))
                },
              }),
            ]}
            className="sm:col-span-2"
          >
            <Input.Password />
          </Form.Item>
        </div>
        <Button type="submit" className="mt-2 w-full sm:w-auto" glow loading={changePasswordMutation.isPending}>
          {translate('profile.security.updatePassword')}
        </Button>
      </Form>
    </div>
  )
}
