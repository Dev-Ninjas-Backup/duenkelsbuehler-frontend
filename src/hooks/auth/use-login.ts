import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth/auth-service"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import type { LoginFormData } from "@/types/auth"

export function useLogin() {
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (user) => {
      setUser(user)
      if (user.role === "service_provider") {
        router.push("/sp/my-services")
      } else if (user.role === "client") {
        router.push("/client/my-services")
      } else {
        router.push("/admin/dashboard")
      }
    },
    onError: (error: Error) => {
      console.error("Login failed:", error.message)
    },
  })
}
