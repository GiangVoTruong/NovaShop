type GoogleCredentialResponse = {
  credential: string
}

type GoogleIdentityConfig = {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
}

type GoogleIdentityApi = {
  initialize: (config: GoogleIdentityConfig) => void
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: 'outline' | 'filled_blue' | 'filled_black'
      size?: 'large' | 'medium' | 'small'
      text?: 'continue_with' | 'signin_with' | 'signup_with'
      width?: number
    },
  ) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdentityApi
      }
    }
  }
}

let scriptLoadPromise: Promise<void> | null = null

export function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve()
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

export function getGoogleClientId(): string | undefined {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  return typeof clientId === 'string' && clientId.trim() ? clientId.trim() : undefined
}

export function renderGoogleSignInButton(
  container: HTMLElement,
  onCredential: (idToken: string) => void,
): void {
  const clientId = getGoogleClientId()
  if (!clientId) {
    return
  }

  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => onCredential(response.credential),
  })

  window.google!.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    width: Math.max(container.offsetWidth, 320),
  })
}
