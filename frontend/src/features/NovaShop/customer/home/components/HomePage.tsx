import { formatCurrency } from '@/features/NovaShop/shared/format'
import CatalogLoadErrorAlert from '@/features/NovaShop/shared/ui/CatalogLoadErrorAlert'
import Button from '@/features/NovaShop/shared/ui/Button'
import StarRating from '@/features/NovaShop/shared/ui/StarRating'
import { PATHS, productDetailPath } from '@/router/paths'
import { Spin } from 'antd'
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Flame,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useCategories } from '../../catalog/hooks/useCategories'
import { useProducts } from '../../catalog/hooks/useProducts'
import { getProductImages, getProductSalePrice } from '../../catalog/lib/productApi'
import { productsPath } from '../../constants/productList.constants'
import CategoryCard from '../../product/components/CategoryCard'
import ProductCard from '../../product/components/ProductCard'
import { BRANDS, HERO_STATS, TESTIMONIALS } from '../constants/home.constants'

const USP_ITEMS = [
  {
    icon: Truck,
    titleKey: 'home.usp.delivery.title',
    descKey: 'home.usp.delivery.desc',
    grad: 'from-cyan-400 to-blue-500',
  },
  {
    icon: ShieldCheck,
    titleKey: 'home.usp.warranty.title',
    descKey: 'home.usp.warranty.desc',
    grad: 'from-emerald-400 to-teal-500',
  },
  {
    icon: RotateCcw,
    titleKey: 'home.usp.returns.title',
    descKey: 'home.usp.returns.desc',
    grad: 'from-amber-400 to-orange-500',
  },
  {
    icon: Headphones,
    titleKey: 'home.usp.support.title',
    descKey: 'home.usp.support.desc',
    grad: 'from-fuchsia-500 to-pink-500',
  },
] as const

export default function HomePage() {
  const { t: translate } = useTranslation()
  const featuredQuery = useProducts({ page: 0, size: 8, sortKey: 'popular' })
  const flashSaleQuery = useProducts({ mode: 'flash-sale', page: 0, size: 4 })
  const categoriesQuery = useCategories()

  const featured = featuredQuery.data?.data ?? []
  const flashSale = flashSaleQuery.data?.data ?? []
  const categories = categoriesQuery.data ?? []
  const heroProduct = featured[0]
  const sideProductA = featured[1]
  const sideProductB = featured[2]
  const isLoadingProducts = featuredQuery.isLoading || flashSaleQuery.isLoading
  const catalogError =
    featuredQuery.error ?? flashSaleQuery.error ?? categoriesQuery.error
  const isCatalogRetrying =
    featuredQuery.isFetching || flashSaleQuery.isFetching || categoriesQuery.isFetching

  const refetchCatalog = () => {
    void featuredQuery.refetch()
    void flashSaleQuery.refetch()
    void categoriesQuery.refetch()
  }

  return (
    <>
      {/* ====== HERO — full width banner ====== */}
      <section className="customer-hero-banner relative isolate w-full overflow-hidden mesh-hero">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-10 lg:py-24 xl:px-14">
          {/* LEFT */}
          <div className="space-y-7 text-white lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles className="size-3.5" /> {translate('home.hero.badge')}
            </span>

            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {translate('home.hero.title')}
              <br />
              <span className="bg-linear-to-r from-pink-300 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">
                {translate('home.hero.titleHighlight')}
              </span>
            </h1>

            <p className="max-w-xl text-base text-white/80 sm:text-lg">
              {translate('home.hero.description')}{' '}
              <span className="text-cyan-300">{translate('home.hero.descriptionHighlight')}</span>.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to={productsPath({ mode: 'explore' })}>
                <Button
                  variant="white"
                  size="lg"
                  rightIcon={<ArrowRight className="size-5" />}
                  className="font-bold"
                >
                  {translate('home.hero.exploreNow')}
                </Button>
              </Link>
              <Link to={productsPath({ mode: 'flash-sale' })}>
                <Button
                  variant="glass"
                  size="lg"
                  className="border-white/40 bg-white/20 font-semibold shadow-lg backdrop-blur-md hover:bg-white/30"
                >
                  {translate('home.hero.flashSaleCta')}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-10 pt-6">
              {HERO_STATS.map((stat) => (
                <div key={stat.labelKey}>
                  <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-white/60">
                    {translate(stat.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative lg:col-span-6">
            {isLoadingProducts ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Spin size="large" />
              </div>
            ) : heroProduct ? (
              <div className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
                <div className="relative aspect-4/5 w-full max-h-[min(520px,72vw)] sm:aspect-5/4 lg:aspect-4/3 lg:max-h-[480px]">
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-3">
                    {/* Main featured product */}
                    <Link
                      to={productDetailPath(heroProduct.id)}
                      className="group/main relative col-span-4 row-span-4 col-start-2 row-start-1 min-h-0 overflow-hidden rounded-3xl ring-1 ring-white/30"
                    >
                      <img
                        src={getProductImages(heroProduct)[0]}
                        alt={heroProduct.name}
                        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover/main:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-white/70">
                            {translate('home.hero.featured.bestseller')}
                          </p>
                          <p className="text-lg font-bold leading-tight">{heroProduct.name}</p>
                        </div>
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
                          {formatCurrency(getProductSalePrice(heroProduct))}
                        </span>
                      </div>
                    </Link>

                    {/* Small floating product B */}
                    {sideProductA && (
                      <Link
                        to={productDetailPath(sideProductA.id)}
                        className="relative col-span-2 row-span-3 col-start-5 row-start-4 min-h-0 overflow-hidden rounded-3xl ring-1 ring-white/30"
                      >
                        <img
                          src={getProductImages(sideProductA)[0]}
                          alt={sideProductA.name}
                          className="absolute inset-0 size-full object-cover"
                        />
                      </Link>
                    )}

                    {/* Glass card stats */}
                    <div className="relative col-span-3 row-span-2 col-start-1 row-start-5 flex flex-col justify-center rounded-3xl border border-white/30 bg-white/15 p-4 backdrop-blur-xl">
                      <div className="flex items-center gap-2 text-white">
                        <span className="grid size-8 place-items-center rounded-xl bg-linear-to-r from-amber-300 to-orange-400 text-slate-900">
                          <Star className="size-4 fill-current" />
                        </span>
                        <p className="text-2xl font-extrabold">4.9</p>
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-wider text-white/70">
                        {translate('home.hero.ratingCard')}
                      </p>
                    </div>

                    {/* Floating circle product */}
                    {sideProductB && (
                      <Link
                        to={productDetailPath(sideProductB.id)}
                        className="relative col-span-1 row-span-1 col-start-1 row-start-2 min-h-0 overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur"
                      >
                        <img
                          src={getProductImages(sideProductB)[0]}
                          alt={sideProductB.name}
                          className="absolute inset-0 size-full object-cover"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Floating badges */}
            <div className="absolute -left-4 top-8 hidden items-center gap-3 rounded-2xl border border-white/30 bg-white/95 p-3 text-slate-900 shadow-2xl backdrop-blur lg:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-linear-to-r from-emerald-400 to-teal-500 text-white">
                <BadgeCheck className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold">{translate('home.hero.badges.authentic.title')}</p>
                <p className="text-xs text-slate-500">
                  {translate('home.hero.badges.authentic.subtitle')}
                </p>
              </div>
            </div>
            <div className="absolute -right-4 bottom-12 hidden items-center gap-3 rounded-2xl border border-white/30 bg-white/95 p-3 text-slate-900 shadow-2xl backdrop-blur lg:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-linear-to-r from-fuchsia-500 to-purple-500 text-white">
                <Zap className="size-5 fill-current" />
              </span>
              <div>
                <p className="text-sm font-bold">{translate('home.hero.badges.delivery.title')}</p>
                <p className="text-xs text-slate-500">
                  {translate('home.hero.badges.delivery.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] space-y-24 px-4 py-6 sm:px-6 lg:px-10 xl:px-14">
        {catalogError ? (
          <CatalogLoadErrorAlert
            error={catalogError}
            onRetry={refetchCatalog}
            isRetrying={isCatalogRetrying}
          />
        ) : null}

        <section className="customer-scroll-section grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {USP_ITEMS.map((feature) => (
            <div
              key={feature.titleKey}
              className="customer-panel group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <span
                className={`mb-4 inline-grid size-12 place-items-center rounded-2xl bg-linear-to-r ${feature.grad} text-white shadow-lg`}
              >
                <feature.icon className="size-5" />
              </span>
              <p className="text-base font-bold tracking-tight text-slate-900">
                {translate(feature.titleKey)}
              </p>
              <p className="mt-1 text-sm text-slate-500">{translate(feature.descKey)}</p>
            </div>
          ))}
        </section>

        {/* ====== CATEGORIES BENTO ====== */}
        <section className="customer-scroll-section">
          <SectionHeading
            eyebrow={translate('home.categories.eyebrow')}
            title={translate('home.categories.title')}
            subtitle={translate('home.categories.subtitle')}
            ctaLabel={translate('home.categories.viewAll')}
            ctaTo={PATHS.PRODUCTS}
          />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2">
            {categories[0] && (
              <div className="min-h-0 h-full sm:col-span-3 sm:row-span-1 lg:col-span-2 lg:row-span-2">
                <CategoryCard category={categories[0]} fill />
              </div>
            )}
            {categories.slice(1, 5).map((category) => (
              <CategoryCard key={category.id} category={category} variant="square" />
            ))}
          </div>
        </section>

        {/* ====== FLASH SALE ====== */}
        <section className="customer-scroll-section relative overflow-hidden rounded-[2.5rem] bg-slate-950 p-6 text-white sm:p-10">
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
            <div className="absolute -right-10 -top-10 size-72 rounded-full bg-rose-500/25" />
            <div className="absolute -bottom-10 -left-10 size-72 rounded-full bg-amber-500/25" />
          </div>

          <div className="relative mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-orange-500 shadow-[0_15px_40px_-5px_rgba(244,63,94,0.5)]">
                <Flame className="size-7" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-rose-300">
                  {translate('home.flashSale.limited')}
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {translate('home.flashSale.title')}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CountdownBox label={translate('home.flashSale.countdown.hours')} value="12" />
              <Colon />
              <CountdownBox label={translate('home.flashSale.countdown.minutes')} value="34" />
              <Colon />
              <CountdownBox label={translate('home.flashSale.countdown.seconds')} value="56" />
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {flashSale.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ====== FEATURED PRODUCTS ====== */}
        <section className="customer-scroll-section">
          <SectionHeading
            eyebrow={translate('home.featured.eyebrow')}
            title={translate('home.featured.title')}
            subtitle={translate('home.featured.subtitle')}
            ctaLabel={translate('home.featured.viewAll')}
            ctaTo={PATHS.PRODUCTS}
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* ====== BRANDS ====== */}
        <section className="customer-scroll-section customer-panel relative overflow-hidden rounded-[2.5rem] p-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            {translate('home.brands.label')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="text-xl font-extrabold tracking-tight text-slate-300 transition-all duration-300 hover:text-gradient hover:scale-110"
              >
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* ====== TESTIMONIALS ====== */}
        <section className="customer-scroll-section">
          <SectionHeading
            center
            eyebrow={translate('home.testimonials.eyebrow')}
            title={translate('home.testimonials.title')}
            subtitle={translate('home.testimonials.subtitle')}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((entry, idx) => (
              <article
                key={entry.name}
                className={`customer-panel relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                  idx === 1 ? 'md:-translate-y-3' : ''
                }`}
              >
                <div
                  className="absolute -right-10 -top-10 size-32 rounded-full opacity-30 blur-2xl"
                  style={{
                    background:
                      idx === 0
                        ? 'radial-gradient(circle, rgba(217,70,239,0.6), transparent)'
                        : idx === 1
                        ? 'radial-gradient(circle, rgba(34,211,238,0.6), transparent)'
                        : 'radial-gradient(circle, rgba(251,146,60,0.6), transparent)',
                  }}
                />
                <div className="relative">
                  <StarRating value={5} size={16} />
                  <p className="mt-4 text-base font-medium leading-relaxed text-slate-700">
                    "{entry.quote}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="size-11 rounded-2xl object-cover ring-2 ring-white"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{entry.name}</p>
                      <p className="text-xs text-slate-500">{translate(entry.roleKey)}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaTo,
  center,
}: {
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaTo?: string
  center?: boolean
}) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        center ? 'sm:flex-col sm:items-center sm:text-center' : ''
      }`}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-gradient">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 customer-section-title sm:text-4xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p>
      </div>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-slate-900 sm:self-end"
        >
          {ctaLabel}
          <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white transition-all group-hover:scale-110 group-hover:bg-linear-to-r group-hover:from-fuchsia-500 group-hover:to-purple-500">
            <ArrowUpRight className="size-4" />
          </span>
        </Link>
      )}
    </div>
  )
}

function CountdownBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 font-mono text-2xl font-extrabold backdrop-blur sm:h-16 sm:w-16 sm:text-3xl">
        {value}
      </span>
      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return <span className="self-start pt-3 text-2xl text-white/40">:</span>
}
