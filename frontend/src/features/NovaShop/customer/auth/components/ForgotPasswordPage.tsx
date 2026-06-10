import Button from '@/features/NovaShop/shared/ui/Button'
import { PATHS } from '@/router/paths'
import { Input, message } from 'antd'
import { ArrowLeft, Mail, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import useForgotPassword from '../hooks/useForgotPassword'

export default function ForgotPasswordPage() {
  const { t: translate } = useTranslation()
  const navigate = useNavigate()
  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') ?? '').trim()

    if (!email) {
      return
    }

    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          message.success(translate('auth.forgotPasswordSent'))
          navigate(PATHS.RESET_PASSWORD, { state: { email } })
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-xl">
        <Link
          to={PATHS.LOGIN}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          {translate('auth.backToLogin')}
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-500 text-white">
            <Sparkles className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {translate('auth.forgotPasswordTitle')}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{translate('auth.forgotPasswordSubtitle')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Mail className="size-4 text-fuchsia-500" />
              {translate('common.email')}
            </span>
            <Input
              required
              type="email"
              name="email"
              size="large"
              placeholder={translate('common.email')}
            />
          </label>

          <Button type="submit" size="lg" fullWidth glow loading={forgotPasswordMutation.isPending}>
            {translate('auth.sendResetCode')}
          </Button>
        </form>
      </div>
    </div>
  )
}
