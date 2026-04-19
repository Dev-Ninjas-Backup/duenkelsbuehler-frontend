export interface SubscriptionPlan {
  id: number
  name: string
  description: string
  amount: number
  currency: string
  interval: "MONTH" | "YEAR"
  isActive: boolean
  isPublic: boolean
}

export interface SubscriptionPayment {
  id: number
  amount: number
  currency: string
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
  paidAt: string | null
  createdAt: string
}

export interface UserSubscription {
  id: number
  status: "PENDING" | "ACTIVE" | "TRIALING" | "PAST_DUE" | "INCOMPLETE" | "CANCELED" | "UNPAID"
  cancelAtPeriodEnd: boolean
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  createdAt: string
  plan: SubscriptionPlan
  payments: SubscriptionPayment[]
}
