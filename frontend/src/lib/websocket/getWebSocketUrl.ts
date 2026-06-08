const DEFAULT_PROD_WS_URL = 'https://novashop-e4ir.onrender.com/ws'

export function getWebSocketUrl(): string {
  const configured = import.meta.env.VITE_WS_URL?.replace(/\/$/, '')
  if (configured) {
    return configured
  }

  if (import.meta.env.PROD) {
    return DEFAULT_PROD_WS_URL
  }

  return `${window.location.origin}/ws`
}
