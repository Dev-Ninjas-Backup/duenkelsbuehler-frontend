import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { favoritesService } from "@/services/favorites/favorites-service"

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? ""
}

export function useMyFavorites() {
  const token = useToken()
  return useQuery({
    queryKey: ["my-favorites"],
    queryFn: () => favoritesService.getMyFavorites(token),
    enabled: !!token,
  })
}

export function useAddFavorite() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.addFavorite(targetUserId, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-favorites"] }),
  })
}

export function useAddFavoriteClient() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.addFavoriteClient(targetUserId, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-favorites"] }),
  })
}

export function useAddFavoriteServiceProvider() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.addFavoriteServiceProvider(targetUserId, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-favorites"] }),
  })
}

export function useRemoveFavorite() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.removeFavorite(targetUserId, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-favorites"] }),
  })
}
