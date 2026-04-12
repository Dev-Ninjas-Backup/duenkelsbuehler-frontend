import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import type {
  LoginFormData,
  SendOtpFormData,
  VerifyOtpFormData,
  CompleteRegistrationFormData,
  SocialLoginFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  SendForgotPasswordOtpFormData,
  VerifyForgotPasswordOtpFormData,
  ResetPasswordWithOtpFormData,
} from "@/types/auth"

// ─── Login ───────────────────────────────────────────────────────
export function useLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const tokenRes = await authService.login(data)
      const user = await authService.getMe(tokenRes.accessToken)
      return { tokenRes, user }
    },
    onSuccess: ({ tokenRes, user }) => {
      setAuth(user, tokenRes.accessToken, tokenRes.role)
      if (tokenRes.role === "SERVICE_PROVIDER") {
        router.push("/sp/my-services")
      } else if (tokenRes.role === "CLIENT") {
        router.push("/client/my-services")
      } else {
        router.push("/admin/dashboard")
      }
    },
  })
}

// ─── Get Current User ─────────────────────────────────────────────
export function useGetMe() {
  const accessToken = useAuthStore((s) => s.accessToken)

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(accessToken!),
    enabled: !!accessToken,
  })
}

// ─── Social Login ─────────────────────────────────────────────────
export function useSocialLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()

  return useMutation({
    mutationFn: async (data: SocialLoginFormData) => {
      const tokenRes = await authService.socialLogin(data)
      const user = await authService.getMe(tokenRes.accessToken)
      return { tokenRes, user }
    },
    onSuccess: ({ tokenRes, user }) => {
      setAuth(user, tokenRes.accessToken, tokenRes.role)
      if (tokenRes.role === "SERVICE_PROVIDER") {
        router.push("/sp/my-services")
      } else {
        router.push("/client/my-services")
      }
    },
  })
}

// ─── Registration OTP Flow ────────────────────────────────────────
export function useSendOtp() {
  return useMutation({
    mutationFn: (data: SendOtpFormData) => authService.sendOtp(data),
  })
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (data: VerifyOtpFormData) => authService.verifyOtp(data),
  })
}

export function useCompleteRegistration() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: CompleteRegistrationFormData) =>
      authService.completeRegistration(data),
    onSuccess: () => {
      router.push("/login")
    },
  })
}

// ─── Forgot Password (Token Flow) ────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormData) => authService.forgotPassword(data),
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordFormData) => authService.resetPassword(data),
    onSuccess: () => {
      router.push("/login")
    },
  })
}

// ─── Forgot Password (OTP Flow) ───────────────────────────────────
export function useSendForgotPasswordOtp() {
  return useMutation({
    mutationFn: (data: SendForgotPasswordOtpFormData) =>
      authService.sendForgotPasswordOtp(data),
  })
}

export function useVerifyForgotPasswordOtp() {
  return useMutation({
    mutationFn: (data: VerifyForgotPasswordOtpFormData) =>
      authService.verifyForgotPasswordOtp(data),
  })
}

export function useResetPasswordWithOtp() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: ResetPasswordWithOtpFormData) =>
      authService.resetPasswordWithOtp(data),
    onSuccess: () => {
      router.push("/login")
    },
  })
}

// ─── Logout ───────────────────────────────────────────────────────
export function useLogout() {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return () => {
    clearAuth()
    router.push("/login")
  }
}
