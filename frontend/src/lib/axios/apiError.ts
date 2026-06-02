import axios from 'axios'

export function isApiTimeoutError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.code === 'ECONNABORTED'
}

export function isRetryableApiError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false
  }
  if (isApiTimeoutError(error) || error.code === 'ERR_NETWORK') {
    return true
  }
  if (!error.response) {
    return true
  }
  const status = error.response.status
  return status >= 500 || status === 408 || status === 429
}
