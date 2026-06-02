import { Spin } from 'antd'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/features/NovaShop/shared/ui/Button'
import AdminPageHeader from '../../layout/components/AdminPageHeader'
import AdminShell from '../../layout/components/AdminShell'
import { useAdminCategories } from '../../hooks/useAdminCatalog'

export default function CategoriesPage() {
  const { t: translate } = useTranslation()
  const categoriesQuery = useAdminCategories()

  if (categoriesQuery.isLoading) {
    return (
      <AdminShell className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" />
      </AdminShell>
    )
  }

  const categories = categoriesQuery.data ?? []

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow={translate('admin.categories.eyebrow')}
        title={translate('admin.categories.title')}
        titleHighlight={translate('admin.categories.titleHighlight')}
        description={translate('admin.categories.description')}
        actions={
          <Button leftIcon={<Plus className="size-4" />} disabled>
            {translate('admin.categories.add')}
          </Button>
        }
      />

      {categories.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-white/20 p-8 text-center text-slate-400">
          {translate('admin.categories.empty')}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="glass-dark rounded-3xl p-5 ring-1 ring-white/10 transition duration-200 hover:-translate-y-1 hover:ring-fuchsia-400/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{category.slug}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
