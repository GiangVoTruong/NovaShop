import { useMemo, type ReactNode } from 'react'
import { useCategories } from '../hooks/useCategories'
import { buildCategorySlugMap } from '../lib/categoryApi'
import { CategorySlugContext } from './categorySlugContext'

export function CategorySlugProvider({ children }: { children: ReactNode }) {
  const categoriesQuery = useCategories()
  const categorySlugById = useMemo(
    () => buildCategorySlugMap(categoriesQuery.data ?? []),
    [categoriesQuery.data],
  )

  return (
    <CategorySlugContext.Provider value={categorySlugById}>
      {children}
    </CategorySlugContext.Provider>
  )
}
