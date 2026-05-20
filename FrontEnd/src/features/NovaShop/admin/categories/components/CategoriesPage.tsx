import { Plus, Pencil } from 'lucide-react'
import { CATEGORIES } from '../../../shared/data/categories'
import { formatNumber } from '../../../shared/format'
import Button from '../../../shared/ui/Button'
import { CategoryTag } from '../../../shared/ui/StatusBadge'
import AdminPageHeader from '../../layout/components/AdminPageHeader'

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-[1440px]">
      <AdminPageHeader
        eyebrow="Quản lý danh mục"
        title={
          <>
            Danh mục <span className="text-gradient">sản phẩm</span>
          </>
        }
        description="Tổ chức sản phẩm theo nhóm để khách hàng dễ tìm kiếm."
        actions={
          <Button leftIcon={<Plus className="size-4" />}>Thêm danh mục</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CATEGORIES.map((category) => (
          <article
            key={category.id}
            className="glass group overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl"
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
                    {formatNumber(category.productCount)} sản phẩm
                  </p>
                </div>
                <CategoryTag category={category.slug} />
              </div>
            </div>
            <div className="flex items-center justify-between p-4">
              <p className="line-clamp-2 text-sm text-slate-600">{category.description}</p>
              <Button variant="ghost" size="sm" leftIcon={<Pencil className="size-4" />}>
                Sửa
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
