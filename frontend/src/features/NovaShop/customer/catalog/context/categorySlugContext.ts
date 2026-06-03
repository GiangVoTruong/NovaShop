import { createContext } from 'react'

export const CategorySlugContext = createContext<Map<string, string>>(new Map())
