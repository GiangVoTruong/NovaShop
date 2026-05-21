export type AuthLoginRequest = {
  email: string
  password: string
}

export type AuthLoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
}

export type AuthRegisterRequest = {
  email: string
  password: string
  fullName: string
  phone: string
}
