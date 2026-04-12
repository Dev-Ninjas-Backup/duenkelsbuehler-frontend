export type UserRole = "CLIENT" | "SERVICE_PROVIDER" | "ADMIN"

// ─── Request Types ───────────────────────────────────────────────
export interface LoginFormData {
  email: string
  password: string
  role: "CLIENT" | "SERVICE_PROVIDER"
}

export interface RegisterFormData {
  email: string
  name: string
  password: string
  role: "CLIENT" | "SERVICE_PROVIDER"
}

export interface SendOtpFormData {
  email: string
  name: string
  password: string
  role?: "CLIENT" | "SERVICE_PROVIDER"
}

export interface VerifyOtpFormData {
  email: string
  otp: string
}

export interface CompleteRegistrationFormData {
  email: string
  password: string
}

export interface SocialLoginFormData {
  idToken: string
  role: "CLIENT" | "SERVICE_PROVIDER"
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  token: string
  newPassword: string
}

export interface SendForgotPasswordOtpFormData {
  email: string
}

export interface VerifyForgotPasswordOtpFormData {
  email: string
  otp: string
}

export interface ResetPasswordWithOtpFormData {
  email: string
  otp: string
  newPassword: string
}

// ─── Response Types ──────────────────────────────────────────────
export interface AuthTokenResponse {
  accessToken: string
  role: UserRole
}

export interface AuthUser {
  id: number
  email: string
  name: string
  role: UserRole[]
  isEmailVerified: boolean
  isIdentityVerified: boolean
  trustapUserId: string | null
  createdAt: string
  updatedAt: string
}

export interface OtpResponse {
  message: string
  email: string
}

export interface MessageResponse {
  message: string
}

// ─── Store Types ─────────────────────────────────────────────────
export interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  role: UserRole | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, accessToken: string, role: UserRole) => void
  clearAuth: () => void
}
