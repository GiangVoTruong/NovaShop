import axios from 'axios'
import i18n from 'i18next'

import { isApiTimeoutError } from '@/lib/axios/apiError'
import type { ApiErrorBody } from '@/types/api.types'
import type { AuthLoginResponse } from '@/types/auth.types'
import type { ApiResponse } from '@/types/product.types'

const defaultApiBaseUrl = import.meta.env.PROD
  ? 'https://novashop-e4ir.onrender.com/api'
  : '/api'

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || defaultApiBaseUrl

const ACCESS_TOKEN_KEY = 'novashop.accessToken'
const REFRESH_TOKEN_KEY = 'novashop.refreshToken'

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

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken())
}

export function getApiErrorMessage(
  error: unknown,
  fallback = i18n.t('common.error'),
): string {
  if (isApiTimeoutError(error)) {
    return i18n.t('common.apiTimeout')
  }
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiErrorBody | undefined
    if (body?.message) return body.message
    if (error.code === 'ERR_NETWORK') {
      return i18n.t('common.apiNetwork')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  // Prod/Render cold start có thể >30s; dev local giữ ngắn để báo lỗi sớm
  timeout: import.meta.env.PROD ? 90_000 : 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<AuthLoginResponse> | null = null

async function refreshAccessToken(): Promise<AuthLoginResponse> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error('Missing refresh token')
  }

  const { data } = await axios.post<ApiResponse<AuthLoginResponse>>(
    `${apiBaseUrl}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  )

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Token refresh failed')
  }
  setTokens(data.data.accessToken, data.data.refreshToken)
  return data.data
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error)) {
      console.error('[API]', error.config?.url, error.response?.status, error.response?.data)

      const originalRequest = error.config
      const status = error.response?.status
      const isAuthRoute = originalRequest?.url?.includes('/auth/')
      const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh')
      const alreadyRetried = originalRequest?._retry
      // Spring Security trả 403 (không phải 401) khi thiếu JWT / access token hết hạn
      const shouldRefreshSession =
        (status === 401 || (status === 403 && !isAuthRoute)) &&
        Boolean(getRefreshToken())

      if (shouldRefreshSession && originalRequest && !isRefreshRequest && !alreadyRetried) {
        originalRequest._retry = true

        try {
          refreshPromise ??= refreshAccessToken().finally(() => {
            refreshPromise = null
          })
          await refreshPromise
          const accessToken = getAccessToken()
          if (accessToken) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          clearTokens()
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  },
)

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}
