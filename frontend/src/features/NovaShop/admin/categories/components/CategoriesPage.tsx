import { Pencil, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CATEGORIES } from '@/features/NovaShop/shared/data/categories'
import Button from '@/features/NovaShop/shared/ui/Button'
import { CategoryTag } from '@/features/NovaShop/shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminShell from '../../layout/components/AdminShell'

export default function CategoriesPage() {
  const { t: translate } = useTranslation()

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow={translate('admin.categories.eyebrow')}
        title={translate('admin.categories.title')}
        titleHighlight={translate('admin.categories.titleHighlight')}
        description={translate('admin.categories.description')}
        actions={
          <Button leftIcon={<Plus className="size-4" />}>{translate('admin.categories.add')}</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="glass-dark group overflow-hidden rounded-3xl ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:ring-fuchsia-400/20"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="size-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                  <p className="text-xs text-slate-300">
                    {translate('admin.categories.productCount', {
                      count: category.productCount,
                    })}
                  </p>
                </div>
                <CategoryTag category={category.slug} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <p className="line-clamp-2 text-sm text-slate-400">{category.description}</p>
              <Button variant="ghost" size="sm" leftIcon={<Pencil className="size-4" />}>
                {translate('admin.categories.edit')}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  )
}
