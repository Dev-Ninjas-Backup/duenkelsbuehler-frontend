import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import type { SignUpFormData } from "@/types/auth"

export function useSignup() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: SignUpFormData) => authService.register(data),
    onSuccess: (user) => {
      setUser(user)
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      console.error("Signup failed:", error.message)
    },
  })
}
