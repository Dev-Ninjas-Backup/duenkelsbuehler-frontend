import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { verifService } from "@/services/verif/verif-service"

export function useCreateVerifSession() {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  return useMutation({
    mutationFn: (file: File) => verifService.createSession(file, token),
  })
}
