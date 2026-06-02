export type UserRole = 'ADMIN' | 'CUSTOMER' | 'SELLER'

export type AuthLoginRequest = {
  email: string
  password: string
}

export type AuthLoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
  role: UserRole
  portalType: string
  permissions?: string[]
}

export type AuthRefreshRequest = {
  refreshToken: string
}

export type AuthRegisterRequest = {
  fullName: string
  email: string
  phone: string
  password: string
}

export type AuthRegisterResponse = {
  message: string
}

export type AuthVerifyEmailRequest = {
  email: string
  otp: string
}

export type AuthResendVerificationRequest = {
  email: string
}

export type UserProfile = {
  id: string
  email: string
  fullName: string
  phone: string
  avatarUrl: string | null
  role: UserRole
  isActive: boolean
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export type UpdateUserProfileRequest = {
  fullName: string
  phone: string
  avatarUrl?: string
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
