import type {
  LoginFormData,
  RegisterFormData,
  SendOtpFormData,
  VerifyOtpFormData,
  CompleteRegistrationFormData,
  SocialLoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  SendForgotPasswordOtpFormData,
  VerifyForgotPasswordOtpFormData,
  ResetPasswordWithOtpFormData,
  AuthTokenResponse,
  AuthUser,
  OtpResponse,
  MessageResponse,
} from "@/types/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  })

  const json = await res.json()

  if (!res.ok) {
    throw new Error(json?.message || "Something went wrong")
  }

  return (json?.data !== undefined ? json.data : json) as T
}

export const authService = {
  // POST /auth/register — sends OTP + creates user with password
  register: (data: RegisterFormData) =>
    request<OtpResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/register/verify-otp — verifies OTP, completes registration
  verifyOtp: (data: VerifyOtpFormData) =>
    request<OtpResponse>("/auth/register/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/login
  login: (data: LoginFormData) =>
    request<AuthTokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/social-login
  socialLogin: (data: SocialLoginFormData) =>
    request<AuthTokenResponse>("/auth/social-login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // GET /auth/me
  getMe: (accessToken: string) =>
    request<AuthUser>("/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  // POST /auth/forgot-password
  forgotPassword: (data: ForgotPasswordFormData) =>
    request<MessageResponse>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/reset-password
  resetPassword: (data: ResetPasswordFormData) =>
    request<MessageResponse>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/send-otp (legacy — kept for compatibility)
  sendOtp: (data: SendOtpFormData) =>
    request<OtpResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/complete-registration (legacy — kept for compatibility)
  completeRegistration: (data: CompleteRegistrationFormData) =>
    request<AuthUser>("/auth/complete-registration", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/forgot-password-otp
  sendForgotPasswordOtp: (data: SendForgotPasswordOtpFormData) =>
    request<MessageResponse>("/auth/forgot-password-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/verify-forgot-password-otp
  verifyForgotPasswordOtp: (data: VerifyForgotPasswordOtpFormData) =>
    request<OtpResponse>("/auth/verify-forgot-password-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // POST /auth/reset-password-otp
  resetPasswordWithOtp: (data: ResetPasswordWithOtpFormData) =>
    request<MessageResponse>("/auth/reset-password-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}
