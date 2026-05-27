import Button from '@/features/NovaShop/shared/ui/Button'
import { PATHS } from '@/router/paths'
import { Input, message } from 'antd'
import { Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useResendVerification from '../hooks/useResendVerification'
import useVerifyEmail from '../hooks/useVerifyEmail'

const RESEND_COOLDOWN_SECONDS = 60

type VerifyEmailLocationState = {
  email?: string
}

export default function VerifyOtpPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as VerifyEmailLocationState | null)?.email ?? ''
  const verifyEmailMutation = useVerifyEmail()
  const resendMutation = useResendVerification()
  const [otp, setOtp] = useState('')
  const [cooldownSeconds, setCooldownSeconds] = useState(RESEND_COOLDOWN_SECONDS)

  useEffect(() => {
    if (!email) {
      navigate(PATHS.REGISTER, { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (cooldownSeconds <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setCooldownSeconds((seconds) => seconds - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [cooldownSeconds])

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (otp.length !== 6) {
      message.error(translate('auth.otpInvalid'))
      return
    }

    verifyEmailMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          message.success(translate('auth.verifySuccess'))
          navigate(PATHS.HOME)
        },
      },
    )
  }

  const handleResend = () => {
    if (cooldownSeconds > 0 || resendMutation.isPending) {
      return
    }

    resendMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setCooldownSeconds(RESEND_COOLDOWN_SECONDS)
        },
      },
    )
  }

  if (!email) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="blob animate-float-slow left-[-10%] top-[-15%] size-[500px] bg-fuchsia-500/60" />
        <div className="blob animate-float-slower right-[-10%] top-[20%] size-[460px] bg-cyan-400/50" />
        <div className="blob animate-float-slow bottom-[-15%] left-[20%] size-[480px] bg-purple-500/60" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-12">
        <div className="w-full max-w-md rounded-4xl border border-white/30 bg-white/85 p-8 shadow-[0_30px_80px_-20px_rgba(168,85,247,0.4)] backdrop-blur-2xl sm:p-10">
          <Link
            to={PATHS.HOME}
            className="mb-6 inline-flex items-center gap-2 text-slate-900"
          >
            <span className="grid size-9 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
              <Sparkles className="size-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Nova<span className="text-gradient">Shop</span>
            </span>
          </Link>

          <div className="mx-auto mb-6 grid size-16 place-items-center rounded-3xl bg-linear-to-br from-fuchsia-500/10 to-purple-500/10">
            <ShieldCheck className="size-8 text-fuchsia-600" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">
            {translate('auth.verifyEmail')}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {translate('auth.enterOtp')}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{translate('auth.otpSubtitle')}</p>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <Mail className="size-4 shrink-0 text-fuchsia-600" />
            <span className="truncate font-medium">{email}</span>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex justify-center">
              <Input.OTP
                length={6}
                size="large"
                value={otp}
                onChange={setOtp}
                disabled={verifyEmailMutation.isPending}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              glow
              disabled={verifyEmailMutation.isPending || otp.length !== 6}
            >
              {verifyEmailMutation.isPending
                ? translate('auth.verifying')
                : translate('auth.verifyNow')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {translate('auth.noOtpReceived')}{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldownSeconds > 0 || resendMutation.isPending}
              className="font-bold text-gradient hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cooldownSeconds > 0
                ? translate('auth.resendOtpIn', { seconds: cooldownSeconds })
                : translate('auth.resendOtp')}
            </button>
          </p>

          <p className="mt-4 text-center text-sm text-slate-600">
            {translate('auth.wrongEmail')}{' '}
            <Link to={PATHS.REGISTER} className="font-bold text-gradient hover:underline">
              {translate('auth.registerAgain')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
