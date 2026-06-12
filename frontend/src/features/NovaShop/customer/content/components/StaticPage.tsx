import Button from '@/features/NovaShop/shared/ui/Button'
import { cx } from '@/features/NovaShop/shared/ui/cx'
import { PATHS } from '@/router/paths'
import { ChevronLeft, ChevronRight, Home, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { StaticPageContent, StaticPageKey } from '../constants/staticPage.constants'
import {
  STATIC_PAGE_ACCENTS,
  STATIC_PAGE_CONTACT_PATH,
  STATIC_PAGE_THEMES,
  getRelatedPagePath,
} from '../constants/staticPageTheme'

interface StaticPageProps {
  pageKey: StaticPageKey
}

export default function StaticPage({ pageKey }: StaticPageProps) {
  const { t: translate } = useTranslation()
  const theme = STATIC_PAGE_THEMES[pageKey]
  const accent = STATIC_PAGE_ACCENTS[theme.accent]
  const PageIcon = theme.icon
  const content = translate(`staticPages.${pageKey}`, {
    returnObjects: true,
  }) as StaticPageContent
  const [activeIndex, setActiveIndex] = useState(0)

  const activeSection = content.sections[activeIndex]
  const isFirstSection = activeIndex === 0
  const isLastSection = activeIndex === content.sections.length - 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link
          to={PATHS.HOME}
          className="inline-flex items-center gap-1.5 font-medium transition hover:text-fuchsia-600"
        >
          <Home className="size-4" />
          {translate('staticPages.backHome')}
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-medium text-slate-700">{content.eyebrow}</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-900">{content.title}</span>
      </nav>

      <div className="customer-panel mt-6 overflow-hidden rounded-[2rem]">
        <div className="border-b border-slate-200/80 bg-slate-50/80 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span
                className={cx(
                  'grid size-14 shrink-0 place-items-center rounded-2xl',
                  accent.iconWrap,
                )}
              >
                <PageIcon className="size-7" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {content.title}
                </h1>
                {content.subtitle ? (
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    {content.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
              {activeIndex + 1}/{content.sections.length}
            </p>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">
            {content.sections.map((section, index) => (
              <button
                key={section.heading}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cx(
                  'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition',
                  index === activeIndex ? accent.navActive : accent.navIdle,
                )}
              >
                {section.heading}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden border-r border-slate-200/80 bg-white/50 p-4 lg:block">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {translate('staticPages.nav.contents')}
            </p>
            <ul className="mt-3 space-y-1">
              {content.sections.map((section, index) => (
                <li key={section.heading}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cx(
                      'flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition',
                      index === activeIndex ? accent.navActive : accent.navIdle,
                    )}
                  >
                    <span
                      className={cx(
                        'mt-1.5 size-2 shrink-0 rounded-full',
                        index === activeIndex ? 'bg-white' : accent.dot,
                      )}
                    />
                    <span className="leading-snug">{section.heading}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex min-h-[320px] flex-col p-6 sm:p-8">
            <article className="flex-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {activeSection.heading}
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{activeSection.body}</p>

              <div
                className={cx(
                  'mt-8 flex items-start gap-3 rounded-2xl border p-4',
                  accent.callout,
                )}
              >
                <MessageCircle className="mt-0.5 size-5 shrink-0 text-slate-500" />
                <p className="text-sm leading-relaxed text-slate-600">
                  {translate('staticPages.sidebar.contactDesc')}
                </p>
              </div>
            </article>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-6">
              <Button
                variant="outline"
                size="md"
                leftIcon={<ChevronLeft className="size-4" />}
                disabled={isFirstSection}
                onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
              >
                {translate('staticPages.nav.prev')}
              </Button>
              <Button
                variant="outline"
                size="md"
                rightIcon={<ChevronRight className="size-4" />}
                disabled={isLastSection}
                onClick={() =>
                  setActiveIndex((current) => Math.min(content.sections.length - 1, current + 1))
                }
              >
                {translate('staticPages.nav.next')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {translate('staticPages.sidebar.related')}:
          </span>
          {theme.relatedKeys.map((relatedKey) => (
            <Link
              key={relatedKey}
              to={getRelatedPagePath(relatedKey)}
              className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:ring-fuchsia-300 hover:text-fuchsia-700"
            >
              {translate(`staticPages.${relatedKey}.title`)}
            </Link>
          ))}
        </div>
        <Link to={STATIC_PAGE_CONTACT_PATH}>
          <Button size="sm" glow>
            {translate('staticPages.sidebar.contactButton')}
          </Button>
        </Link>
      </footer>
    </div>
  )
}
