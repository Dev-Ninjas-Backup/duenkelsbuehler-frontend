import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { reviewsService } from "@/services/reviews/reviews-service"
import type { CreateReviewData } from "@/types/reviews"

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? ""
}

export function useMyGivenReviews() {
  const token = useToken()
  return useQuery({
    queryKey: ["my-given-reviews"],
    queryFn: () => reviewsService.getMyGivenReviews(token),
    enabled: !!token,
  })
}

export function useCreateReview() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ serviceId, revieweeId, data }: { serviceId: number; revieweeId: number; data: CreateReviewData }) =>
      reviewsService.createReview(serviceId, revieweeId, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-given-reviews"] }),
  })
}

export function useCreateReviewForClient() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ serviceId, clientId, data }: { serviceId: number; clientId: number; data: CreateReviewData }) =>
      reviewsService.createReviewForClient(serviceId, clientId, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-given-reviews"] }),
  })
}

export function useCreateReviewForServiceProvider() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ serviceId, serviceProviderId, data }: { serviceId: number; serviceProviderId: number; data: CreateReviewData }) =>
      reviewsService.createReviewForServiceProvider(serviceId, serviceProviderId, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-given-reviews"] }),
  })
}
