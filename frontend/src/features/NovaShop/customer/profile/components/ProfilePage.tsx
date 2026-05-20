import { PATHS } from '@/router/paths'
import { message } from 'antd'
import { CreditCard, MapPin, Pencil, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CUSTOMERS } from '../../../shared/data/customers'
import Button from '../../../shared/ui/Button'
import { cx } from '../../../shared/ui/cx'
import { PROFILE_TABS } from '../constants/profile.constants'

export default function ProfilePage() {
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
              Thành viên Gold ⭐
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight">Xin chào, {profile.name}!</h1>
            <p className="mt-1 text-sm text-white/80">
              {profile.totalOrders} đơn hàng · Tham gia từ {profile.joinedAt}
            </p>
          </div>
          <Button variant="white" leftIcon={<Pencil className="size-4" />}>
            Chỉnh sửa
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
                {entry.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {tab === 'profile' && <ProfileForm profile={profile} />}
          {tab === 'orders' && (
            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-extrabold tracking-tight">Đơn hàng gần đây</h2>
              <p className="mt-2 text-sm text-slate-500">
                Xem chi tiết tại trang{' '}
                <Link to={PATHS.ORDERS} className="font-bold text-fuchsia-600 hover:underline">
                  Đơn hàng
                </Link>
                .
              </p>
            </div>
          )}
          {tab === 'wishlist' && (
            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
              <h2 className="text-xl font-extrabold tracking-tight">Sản phẩm yêu thích</h2>
              <p className="mt-2 text-sm text-slate-500">
                Xem chi tiết tại{' '}
                <Link to={PATHS.WISHLIST} className="font-bold text-fuchsia-600 hover:underline">
                  Danh sách yêu thích
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
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        message.success('Cập nhật thông tin thành công')
      }}
      className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl"
    >
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Thông tin cá nhân</h2>
      <p className="text-sm text-slate-500">Cập nhật thông tin để bảo vệ tài khoản</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Họ và tên', value: profile.name },
          { label: 'Email', value: profile.email },
          { label: 'Số điện thoại', value: profile.phone },
          { label: 'Ngày tham gia', value: profile.joinedAt },
        ].map((field) => (
          <div key={field.label}>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">{field.label}</p>
            <input
              defaultValue={field.value}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-6" glow>
        Lưu thay đổi
      </Button>
    </form>
  )
}

function AddressSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Sổ địa chỉ</h2>
        <Button glow>+ Thêm địa chỉ</Button>
      </div>
      {[
        {
          name: 'Nhà riêng',
          address: '12 Nguyễn Huệ, P. Bến Nghé, Q.1, TP. HCM',
          default: true,
        },
        {
          name: 'Văn phòng',
          address: '88 Nguyễn Văn Trỗi, Q. Phú Nhuận, TP. HCM',
          default: false,
        },
      ].map((entry) => (
        <article
          key={entry.name}
          className="flex items-start justify-between gap-4 rounded-3xl border border-white/60 bg-white/85 p-5 backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
              <MapPin className="size-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-slate-900">{entry.name}</p>
                {entry.default && (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{entry.address}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Sửa
          </Button>
        </article>
      ))}
    </div>
  )
}

function PaymentSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Phương thức thanh toán
        </h2>
        <Button glow>+ Thêm thẻ</Button>
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
            Xoá
          </Button>
        </article>
      ))}
    </div>
  )
}

function NotificationSection() {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
      <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Cài đặt thông báo</h2>
      <ul className="mt-4 space-y-3">
        {[
          'Email — Thông báo đơn hàng mới',
          'Email — Khuyến mãi & ưu đãi',
          'SMS — Cảnh báo bảo mật',
          'Push — Cập nhật trạng thái giao hàng',
        ].map((label) => (
          <li
            key={label}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
          >
            <span className="text-sm text-slate-700">{label}</span>
            <input type="checkbox" defaultChecked className="size-5 accent-fuchsia-600" />
          </li>
        ))}
      </ul>
    </div>
  )
}

function SecuritySection() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-teal-50 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 text-white shadow-md">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="font-bold text-slate-900">Bảo mật 2 lớp đã bật</p>
            <p className="text-sm text-slate-600">Xác thực qua Google Authenticator</p>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-white/60 bg-white/85 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Đổi mật khẩu</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm focus:border-fuchsia-500 focus:outline-none"
          />
        </div>
        <Button className="mt-4" glow>
          Cập nhật mật khẩu
        </Button>
      </div>
    </div>
  )
}
