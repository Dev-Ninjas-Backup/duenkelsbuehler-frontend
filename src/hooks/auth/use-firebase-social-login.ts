"use client"

import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth, googleProvider, appleProvider } from "@/lib/firebase"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import type { UserRole } from "@/types/auth"

export function useFirebaseSocialLogin() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginWithGoogle = async (role: "CLIENT" | "SERVICE_PROVIDER") => {
    setIsPending(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      const tokenRes = await authService.socialLogin({ idToken, role, provider: "GOOGLE" })
      const user = await authService.getMe(tokenRes.accessToken)
      setAuth(user, tokenRes.accessToken, tokenRes.role as UserRole)
      redirect(tokenRes.role as UserRole, router)
    } catch (err: any) {
      setError(err?.message || "Google login failed")
    } finally {
      setIsPending(false)
    }
  }

  const loginWithApple = async (role: "CLIENT" | "SERVICE_PROVIDER") => {
    setIsPending(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, appleProvider)
      const idToken = await result.user.getIdToken()
      const tokenRes = await authService.socialLogin({ idToken, role, provider: "APPLE" })
      const user = await authService.getMe(tokenRes.accessToken)
      setAuth(user, tokenRes.accessToken, tokenRes.role as UserRole)
      redirect(tokenRes.role as UserRole, router)
    } catch (err: any) {
      setError(err?.message || "Apple login failed")
    } finally {
      setIsPending(false)
    }
  }

  return { loginWithGoogle, loginWithApple, isPending, error }
}

function redirect(role: UserRole, router: ReturnType<typeof useRouter>) {
  if (role === "SERVICE_PROVIDER") router.push("/sp/my-services")
  else if (role === "CLIENT") router.push("/client/my-services")
  else router.push("/admin/dashboard")
}
