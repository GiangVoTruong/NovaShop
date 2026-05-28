import Button from '@/features/NovaShop/shared/ui/Button'
import { PATHS } from '@/router/paths'
import { message } from 'antd'
import { Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { isEmailNotVerifiedError } from '../lib/authErrors'
import useLogin from '../hooks/useLogin'

export default function LoginPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const heroStats = [
    { value: '120K+', label: translate('auth.statCustomers') },
    { value: '4.9★', label: translate('auth.statRating') },
    { value: '15K+', label: translate('auth.statProducts') },
  ]

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          message.success(translate('auth.loginSuccess'))
          const redirectTo =
            (location.state as { from?: string } | null)?.from ?? PATHS.HOME
          navigate(redirectTo, { replace: true })
        },
        onError: (error) => {
          if (!isEmailNotVerifiedError(error)) {
            return
          }

          message.info(translate('auth.verificationEmailResent'))
          navigate(PATHS.VERIFY_EMAIL, {
            replace: true,
            state: { email, fromLogin: true },
          })
        },
      },
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="blob animate-float-slow left-[-10%] top-[-15%] size-[500px] bg-fuchsia-500/60" />
        <div className="blob animate-float-slower right-[-10%] top-[20%] size-[460px] bg-cyan-400/50" />
        <div className="blob animate-float-slow bottom-[-15%] left-[20%] size-[480px] bg-purple-500/60" />
      </div>

      <div className="relative grid min-h-screen lg:grid-cols-2">
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
              {translate('auth.heroTitle')}
              <br />
              <span className="bg-linear-to-r from-pink-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">
                {translate('auth.heroTitleHighlight')}
              </span>
            </h2>
            <p className="max-w-md text-base text-white/80">{translate('auth.heroDescription')}</p>
            <div className="flex gap-8 pt-4">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wider text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/50">{translate('auth.copyright')}</p>
        </div>

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
              {translate('auth.welcomeBack')}
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {translate('auth.login')}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{translate('auth.loginSubtitle')}</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <FieldGroup icon={Mail}>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder={translate('common.email')}
                  className="auth-input"
                  defaultValue="minhanh@nova.shop"
                />
              </FieldGroup>

              <FieldGroup icon={Lock}>
                <input
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={translate('common.password')}
                  className="auth-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={translate('auth.showPassword')}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </FieldGroup>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="size-4 rounded border-slate-300 text-fuchsia-600"
                  />
                  {translate('auth.rememberMe')}
                </label>
                <a href="#" className="font-semibold text-fuchsia-600 hover:underline">
                  {translate('auth.forgotPassword')}
                </a>
              </div>

              <Button type="submit" size="lg" fullWidth glow disabled={loginMutation.isPending}>
                {loginMutation.isPending ? translate('auth.loggingIn') : translate('auth.loginNow')}
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  {translate('common.or')}
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <Button variant="outline" size="lg" fullWidth type="button">
                {translate('auth.continueWithGoogle')}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-600">
              {translate('auth.noAccount')}{' '}
              <Link to={PATHS.REGISTER} className="font-bold text-gradient hover:underline">
                {translate('auth.signUpNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldGroup({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      {children}
    </div>
  )
}
