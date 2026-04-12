import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { filesService } from "@/services/files/files-service"

export function useUploadImage() {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  return useMutation({
    mutationFn: (file: File) => filesService.uploadImage(file, token),
  })
}

export function useUploadDocument() {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  return useMutation({
    mutationFn: (file: File) => filesService.uploadDocument(file, token),
  })
}
