import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { verifService, CreateVerifSessionData } from "@/services/verif/verif-service"

export function useCreateVerifSession() {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  return useMutation({
    mutationFn: (data: CreateVerifSessionData) => verifService.createSession(data, token),
  })
}
