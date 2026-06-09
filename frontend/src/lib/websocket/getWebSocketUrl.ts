const DEFAULT_PROD_WS_URL = 'https://novashop-e4ir.onrender.com/ws'

export function getWebSocketUrl(accessToken?: string | null): string {
  const configured = import.meta.env.VITE_WS_URL?.replace(/\/$/, '')
  const baseUrl = configured
    ? configured
    : import.meta.env.PROD
      ? DEFAULT_PROD_WS_URL
      : `${window.location.origin}/ws`

  if (!accessToken) {
    return baseUrl
  }

  const separator = baseUrl.includes('?') ? '&' : '?'
  return `${baseUrl}${separator}access_token=${encodeURIComponent(accessToken)}`
}
