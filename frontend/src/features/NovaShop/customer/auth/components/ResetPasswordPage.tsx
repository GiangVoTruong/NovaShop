import Button from '@/features/NovaShop/shared/ui/Button'
import { PATHS } from '@/router/paths'
import { Input, message } from 'antd'
import { ArrowLeft, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useResetPassword } from '../hooks/useResetPassword'

type ResetPasswordLocationState = {
  email?: string
}

export default function ResetPasswordPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as ResetPasswordLocationState | null
  const email = locationState?.email ?? ''
  const resetPasswordMutation = useResetPassword()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!email) {
      navigate(PATHS.FORGOT_PASSWORD, { replace: true })
    }
  }, [email, navigate])

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const otp = String(formData.get('otp') ?? '').trim()
    const newPassword = String(formData.get('newPassword') ?? '')

    if (otp.length !== 6) {
      message.error(translate('auth.otpInvalid'))
      return
    }

    resetPasswordMutation.mutate(
      { email, otp, newPassword },
      {
        onSuccess: () => {
          message.success(translate('auth.resetPasswordSuccess'))
          navigate(PATHS.LOGIN, { replace: true })
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl">
        <Link
          to={PATHS.FORGOT_PASSWORD}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {translate('auth.forgotPasswordTitle')}
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {translate('auth.resetPasswordTitle')}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{translate('auth.resetPasswordSubtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail className="size-4 text-fuchsia-500" />
              {translate('common.email')}
            </span>
            <Input value={email} readOnly size="large" />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ShieldCheck className="size-4 text-fuchsia-500" />
              {translate('auth.enterOtp')}
            </span>
            <Input required name="otp" size="large" maxLength={6} inputMode="numeric" />
          </label>

          <label className="relative block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Lock className="size-4 text-fuchsia-500" />
              {translate('auth.newPassword')}
            </span>
            <Input
              required
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              size="large"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-[38px] text-xs font-semibold text-fuchsia-600"
            >
              {translate('auth.showPassword')}
            </button>
          </label>

          <Button type="submit" size="lg" fullWidth glow loading={resetPasswordMutation.isPending}>
            {translate('auth.resetPasswordNow')}
          </Button>
        </form>
      </div>
    </div>
  )
}
