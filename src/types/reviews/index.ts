export interface ReviewedUser {
  id: number
  name: string
  email: string
  role: string[]
}

export interface ReviewService {
  id: number
  description: string
  industry: string
  location: string
}

export interface GivenReview {
  reviewId: number
  reviewStatus: "PENDING" | "SUBMITTED"
  rating: number
  comment: string | null
  createdAt: string
  service: ReviewService
  reviewedUser: ReviewedUser
}

export interface CreateReviewData {
  rating: number
  comment?: string
}
