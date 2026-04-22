// ─── Banner ──────────────────────────────────────────────────────
export interface Banner {
  id: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}
export interface CreateBannerData { imageUrl: string }
export interface UpdateBannerData { imageUrl?: string }

// ─── Blog ─────────────────────────────────────────────────────────
export interface Blog {
  id: number
  title: string
  content: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}
export interface CreateBlogData { title: string; content: string; imageUrl: string }
export interface UpdateBlogData { title?: string; content?: string; imageUrl?: string }

// ─── User ────────────────────────────────────────────────────────
export interface AdminUser {
  id: number
  email: string
  name: string
  role: string[]
  country: string | null
  isIdentityVerified: boolean
  isEmailVerified: boolean
  firebaseUid: string | null
  PROVIDER: "GOOGLE" | "APPLE" | "PASSWORD" | null
  createdAt: string
  updatedAt: string
}

// ─── Badge ────────────────────────────────────────────────────────
export type BadgeType =
  | "LEFT_A_RATING"
  | "COMPLETED_A_TRANSACTION"
  | "ATTACHED_A_CONTRACT"
  | "SUBSCRIBED_TO_ARISTO_ACCESS_PLUS"
  | "VERIFIED_ACCOUNT"
  | "SENT_A_PROPOSAL"

export interface Badge {
  id: number
  type: BadgeType
  title: string
  description: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}
export interface CreateBadgeData { type: BadgeType; title: string; description: string; imageUrl: string }
export interface UpdateBadgeData { type?: BadgeType; title?: string; description?: string; imageUrl?: string }
