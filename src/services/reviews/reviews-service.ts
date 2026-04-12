import type { GivenReview, CreateReviewData } from "@/types/reviews"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    ...options,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

export const reviewsService = {
  createReview: (serviceId: number, revieweeId: number, data: CreateReviewData, token: string) =>
    request<GivenReview>(`/reviews/services/${serviceId}/users/${revieweeId}`, token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createReviewForClient: (serviceId: number, clientId: number, data: CreateReviewData, token: string) =>
    request<GivenReview>(`/reviews/services/${serviceId}/clients/${clientId}`, token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createReviewForServiceProvider: (serviceId: number, serviceProviderId: number, data: CreateReviewData, token: string) =>
    request<GivenReview>(`/reviews/services/${serviceId}/service-providers/${serviceProviderId}`, token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyGivenReviews: (token: string) =>
    request<GivenReview[]>("/reviews/me/given", token),
}
