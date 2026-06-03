import { Spin } from 'antd'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/features/NovaShop/shared/ui/Button'
import AdminEmptyState from '../../layout/components/AdminEmptyState'
import AdminPage from '../../layout/components/AdminPage'
import { useAdminCategories } from '../../hooks/useAdminCatalog'

export default function CategoriesPage() {
  const { t: translate } = useTranslation()
  const categoriesQuery = useAdminCategories()

  if (categoriesQuery.isLoading) {
    return (
      <AdminPage
        eyebrow={translate('admin.categories.eyebrow')}
        title={translate('admin.categories.title')}
        titleHighlight={translate('admin.categories.titleHighlight')}
        description={translate('admin.categories.description')}
      >
        <Spin size="large" />
      </AdminPage>
    )
  }

  const categories = categoriesQuery.data ?? []

  return (
    <AdminPage
      eyebrow={translate('admin.categories.eyebrow')}
      title={translate('admin.categories.title')}
      titleHighlight={translate('admin.categories.titleHighlight')}
      description={translate('admin.categories.description')}
      actions={
        <Button leftIcon={<Plus className="size-4" />} disabled>
          {translate('admin.categories.add')}
        </Button>
      }
    >
      {categories.length === 0 ? (
        <AdminEmptyState message={translate('admin.categories.empty')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-blue-300"
            >
              <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-400">{category.slug}</p>
            </article>
          ))}
        </div>
      )}
    </AdminPage>
  )
}
