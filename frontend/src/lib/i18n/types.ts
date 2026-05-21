export const SUPPORTED_LANGUAGES = ['vi', 'en'] as const

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: AppLanguage = 'vi'

export const LANGUAGE_STORAGE_KEY = 'novashop.language'
