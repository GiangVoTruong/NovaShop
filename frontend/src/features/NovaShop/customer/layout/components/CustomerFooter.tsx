import { PATHS } from '@/router/paths'
import Button from '@/features/NovaShop/shared/ui/Button'
import { ArrowUpRight, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CUSTOMER_FOOTER_COLS, CUSTOMER_SOCIAL_LINKS } from '../constants/layout.constants'

export default function CustomerFooter() {
  const { t: translate } = useTranslation()

  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 xl:px-14">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-fuchsia-500 via-purple-600 to-indigo-600 p-8 text-white shadow-[0_30px_80px_-20px_rgba(168,85,247,0.5)] sm:p-12">
          <div className="absolute -left-20 -top-20 size-72 rounded-full bg-pink-300/40 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-cyan-300/40 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                <Sparkles className="size-3.5" /> {translate('footer.newsletter.badge')}
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {translate('footer.newsletter.title')}
                <br />
                {translate('footer.newsletter.titleLine2')}
              </h2>
              <p className="mt-3 max-w-md text-sm text-white/85">
                {translate('footer.newsletter.description')}
              </p>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder={translate('footer.newsletter.emailPlaceholder')}
                className="h-14 flex-1 rounded-2xl border border-white/30 bg-white/15 px-5 text-sm text-white placeholder:text-white/70 backdrop-blur transition-all focus:border-white/60 focus:bg-white/20 focus:outline-none"
              />
              <Button
                type="submit"
                variant="white"
                size="lg"
                rightIcon={<ArrowUpRight className="size-4" />}
                className="h-14!"
              >
                {translate('footer.newsletter.subscribe')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-slate-950 text-slate-300">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10 xl:px-14">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white">
                  <Sparkles className="size-5" />
                </span>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Nova<span className="text-gradient">Shop</span>
                </span>
              </div>
              <p className="mt-4 max-w-md text-sm text-slate-400">
                {translate('footer.brand.description')}
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/5 text-fuchsia-300">
                    <MapPin className="size-4" />
                  </span>
                  {translate('footer.contact.address')}
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/5 text-cyan-300">
                    <Phone className="size-4" />
                  </span>
                  {translate('footer.contact.phone')}
                </li>
                <li className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/5 text-amber-300">
                    <Mail className="size-4" />
                  </span>
                  {translate('footer.contact.email')}
                </li>
              </ul>
            </div>

            {CUSTOMER_FOOTER_COLS.map((column) => (
              <div key={column.titleKey} className="lg:col-span-2">
                <p className="text-sm font-bold uppercase tracking-wider text-white">
                  {translate(column.titleKey)}
                </p>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.labelKey}>
                      <Link
                        to={link.to}
                        className="text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {translate(link.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="lg:col-span-1">
              <p className="text-sm font-bold uppercase tracking-wider text-white">
                {translate('footer.follow')}
              </p>
              <div className="mt-5 flex gap-2">
                {CUSTOMER_SOCIAL_LINKS.map((entry) => (
                  <a
                    key={entry.labelKey}
                    href="#"
                    aria-label={translate(entry.labelKey)}
                    className="grid size-10 place-items-center rounded-xl bg-white/5 text-sm font-bold text-white transition-all hover:scale-110 hover:bg-linear-to-br hover:from-fuchsia-500 hover:to-purple-500"
                  >
                    {entry.initial}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>{translate('footer.copyright')}</p>
            <div className="flex items-center gap-4">
              <Link to={PATHS.LEGAL_TERMS} className="hover:text-white">
                {translate('footer.legal.terms')}
              </Link>
              <Link to={PATHS.LEGAL_PRIVACY} className="hover:text-white">
                {translate('footer.legal.privacy')}
              </Link>
              <Link to={PATHS.LEGAL_COOKIES} className="hover:text-white">
                {translate('footer.legal.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
