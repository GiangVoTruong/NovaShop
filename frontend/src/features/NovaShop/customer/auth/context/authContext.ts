import { createContext } from 'react'
import type { UserProfile } from '@/types/auth.types'

export type LoginSessionInput = {
  accessToken: string
  refreshToken?: string | null
}

export type AuthContextValue = {
  user: UserProfile | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  loginSession: (tokens: LoginSessionInput) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<UserProfile | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
