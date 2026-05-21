import axios from 'axios'
import i18n from 'i18next'

import type { ApiErrorBody } from '@/types/api.types'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '/api'

const ACCESS_TOKEN_KEY = 'novashop.accessToken'
const REFRESH_TOKEN_KEY = 'novashop.refreshToken'

// --- Lưu token sau khi login ---
export function setTokens(accessToken: string, refreshToken?: string | null): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

// --- Đọc message lỗi từ backend (dùng trong catch) ---
export function getApiErrorMessage(
  error: unknown,
  fallback = i18n.t('common.error'),
): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) return body.message
    return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

// --- Instance dùng chung — import từ đây, không tạo axios.create ở chỗ khác ---
export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Mỗi request tự gắn JWT nếu đã login
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error('[API]', error.config?.url, error.response?.status, error.response?.data)
    }
    return Promise.reject(error)
  },
)
