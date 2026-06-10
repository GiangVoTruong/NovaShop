import { useEffect, useRef } from 'react'
import { getGoogleClientId, loadGoogleIdentityScript, renderGoogleSignInButton } from '../lib/googleIdentity'

type GoogleSignInButtonProps = {
  onCredential: (idToken: string) => void
  disabled?: boolean
}

export default function GoogleSignInButton({ onCredential, disabled = false }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const clientId = getGoogleClientId()

  useEffect(() => {
    if (!clientId || disabled || !containerRef.current) {
      return
    }

    let cancelled = false

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !containerRef.current) {
          return
        }
        containerRef.current.replaceChildren()
        renderGoogleSignInButton(containerRef.current, onCredential)
      })
      .catch(() => {
        // Parent handles missing Google config via fallback UI
      })

    return () => {
      cancelled = true
    }
  }, [clientId, disabled, onCredential])

  if (!clientId) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className={disabled ? 'pointer-events-none opacity-60' : 'flex w-full justify-center'}
    />
  )
}
