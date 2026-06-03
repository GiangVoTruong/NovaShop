import { useContext } from 'react'
import { CategorySlugContext } from '../context/categorySlugContext'

export function useCategorySlugMap(): Map<string, string> {
  return useContext(CategorySlugContext)
}
