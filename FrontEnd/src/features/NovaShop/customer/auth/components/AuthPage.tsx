import { PATHS } from '@/router/paths'
import { message } from 'antd'
import { Eye, EyeOff, Lock, Mail, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../../shared/ui/Button'

interface AuthPageProps {
  mode: 'login' | 'register'
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const isLogin = mode === 'login'

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    message.success(isLogin ? 'Đăng nhập thành công' : 'Đăng ký thành công')
    navigate(PATHS.HOME)
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-hero">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="blob animate-float-slow left-[-10%] top-[-15%] size-[500px] bg-fuchsia-500/60" />
        <div className="blob animate-float-slower right-[-10%] top-[20%] size-[460px] bg-cyan-400/50" />
        <div className="blob animate-float-slow bottom-[-15%] left-[20%] size-[480px] bg-purple-500/60" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* SIDE PANEL */}
        <div className="hidden flex-col justify-between p-12 text-white lg:flex">
          <Link to={PATHS.HOME} className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-white/15 backdrop-blur-md">
              <Sparkles className="size-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Nova
              <span className="bg-linear-to-r from-pink-300 to-cyan-200 bg-clip-text text-transparent">
                Shop
              </span>
            </span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight">
              Shop the
              <br />
              <span className="bg-linear-to-r from-pink-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">
                future, today.
              </span>
            </h2>
            <p className="max-w-md text-base text-white/80">
              Trải nghiệm mua sắm hiện đại với hơn 15,000 sản phẩm chính hãng, giao hàng 2 giờ và
              đổi trả 30 ngày miễn phí.
            </p>
            <div className="flex gap-8 pt-4">
              {[
                { value: '120K+', label: 'Khách hàng' },
                { value: '4.9★', label: 'Đánh giá' },
                { value: '15K+', label: 'Sản phẩm' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/50">© 2026 NovaShop. Made in Vietnam.</p>
        </div>

        {/* FORM */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md rounded-4xl border border-white/30 bg-white/85 p-8 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.4)] backdrop-blur-2xl sm:p-10">
            <Link
              to={PATHS.HOME}
              className="mb-6 inline-flex items-center gap-2 text-slate-900 lg:hidden"
            >
              <span className="grid size-9 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
                <Sparkles className="size-5" />
              </span>
              <span className="text-xl font-extrabold tracking-tight">
                Nova<span className="text-gradient">Shop</span>
              </span>
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              {isLogin
                ? 'Mua sắm dễ dàng — quản lý đơn hàng trong tích tắc.'
                : 'Tham gia 120K+ khách hàng đang yêu thích NovaShop.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {!isLogin && (
                <FieldGroup icon={User}>
                  <input required placeholder="Họ và tên" className="auth-input" />
                </FieldGroup>
              )}
              <FieldGroup icon={Mail}>
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="auth-input"
                  defaultValue={isLogin ? 'minhanh@nova.shop' : ''}
                />
              </FieldGroup>
              <FieldGroup icon={Lock}>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu"
                  className="auth-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Hiện mật khẩu"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </FieldGroup>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="size-4 rounded border-slate-300 text-fuchsia-600"
                    />
                    Ghi nhớ
                  </label>
                  <a href="#" className="font-semibold text-fuchsia-600 hover:underline">
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              <Button type="submit" size="lg" fullWidth glow>
                {isLogin ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-widest text-slate-400">hoặc</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Button variant="outline" size="lg" fullWidth type="button">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M5.3 14.5l-.8 3-3 .1A11 11 0 011 12C1 10.3 1.4 8.7 2 7.3l2.7.5.9 2.7a6.6 6.6 0 00-.3 4z"
                  />
                  <path
                    fill="#34A853"
                    d="M22.6 9.8H12v4.4h6.1A5.2 5.2 0 0112 17.4a5.4 5.4 0 01-5-3.4l-2.6 2.1A11 11 0 0023 12c0-.7 0-1.4-.4-2.2z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M22.6 9.8H12v4.4h6.1c-.3.9-1 1.9-2 2.5l3 2.4A11 11 0 0023 12c0-.7 0-1.4-.4-2.2z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5 14a6.6 6.6 0 010-4l-3.4-.6A11 11 0 001 12c0 1.8.4 3.5 1.2 5.1L5 14z"
                  />
                </svg>
                Tiếp tục với Google
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <Link
                to={isLogin ? PATHS.REGISTER : PATHS.LOGIN}
                className="font-bold text-gradient hover:underline"
              >
                {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .auth-input {
          width: 100%;
          height: 50px;
          border-radius: 14px;
          border: 1px solid rgb(226 232 240);
          padding-left: 44px;
          padding-right: 12px;
          font-size: 14px;
          background-color: rgb(248 250 252);
          color: rgb(15 23 42);
          transition: all 200ms;
        }
        .auth-input:focus {
          outline: none;
          border-color: rgb(217 70 239);
          background-color: white;
          box-shadow: 0 0 0 4px rgb(250 232 255);
        }
      `}</style>
    </div>
  )
}

function FieldGroup({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  )
}
