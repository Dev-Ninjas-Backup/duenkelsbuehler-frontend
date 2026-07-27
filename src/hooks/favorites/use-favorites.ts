import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { favoritesService } from "@/services/favorites/favorites-service"

import { toast } from "sonner"

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-favorites"] })
      toast.success("Saved successfully!")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save")
    },
  })
}

export function useAddFavoriteClient() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.addFavoriteClient(targetUserId, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-favorites"] })
      toast.success("Client saved successfully!")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save client")
    },
  })
}

export function useAddFavoriteServiceProvider() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.addFavoriteServiceProvider(targetUserId, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-favorites"] })
      toast.success("Service Provider saved successfully!")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save service provider")
    },
  })
}

export function useRemoveFavorite() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (targetUserId: number) => favoritesService.removeFavorite(targetUserId, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-favorites"] })
      toast.success("Removed from saved!")
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to remove from saved")
    },
  })
}
