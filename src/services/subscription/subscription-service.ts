import type { UserSubscription, SubscriptionPlan } from "@/types/subscription"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, token?: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

export interface CreatePlanData {
  name: string
  description?: string
  amount: number
  currency: string
  interval: "MONTH" | "YEAR"
  metadata?: Record<string, unknown>
}

export interface UpdatePlanData {
  name?: string
  description?: string
  amount?: number
  currency?: string
  interval?: "MONTH" | "YEAR"
  isActive?: boolean
}

export interface FinanceSummary {
  currency: string
  totalRevenueUsd: number
  activeSubscriptions: number
  monthlyRevenue: { month: string; revenueUsd: number }[]
}

export interface SubscriptionPayment {
  id: number
  amount: number
  currency: string
  status: string
  paidAt: string | null
  createdAt: string
  plan: { id: number; name: string }
  user: { id: number; email: string; name: string }
}

export interface AdminSubscriber {
  id: number
  userId: number
  planId: number
  status: string
  createdAt: string
  currentPeriodStart: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export const subscriptionService = {
  // ─── Public ───────────────────────────────────────────────────
  getPlans: () =>
    request<SubscriptionPlan[]>("/subscriptions/plans"),

  // ─── User ─────────────────────────────────────────────────────
  getMySubscriptions: (token: string) =>
    request<UserSubscription[]>("/subscriptions/me", token),

  createCheckoutSession: (data: { planId: number; successUrl: string; cancelUrl: string }, token: string) =>
    request<{ checkoutUrl: string; checkoutSessionId: string }>("/subscriptions/checkout-session", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  cancelSubscription: (subscriptionId: number, token: string) =>
    request<UserSubscription>(`/subscriptions/me/${subscriptionId}/cancel`, token, {
      method: "PATCH",
    }),

  createCustomPlan: (data: CreatePlanData, token: string) =>
    request<SubscriptionPlan>("/subscriptions/plans/custom", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ─── Admin ────────────────────────────────────────────────────
  adminCreatePlan: (data: CreatePlanData, token: string) =>
    request<SubscriptionPlan>("/subscriptions/admin/plans", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  adminGetPlans: (token: string) =>
    request<SubscriptionPlan[]>("/subscriptions/admin/plans", token),

  adminUpdatePlan: (planId: number, data: UpdatePlanData, token: string) =>
    request<SubscriptionPlan>(`/subscriptions/admin/plans/${planId}`, token, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  adminGetFinanceSummary: (token: string) =>
    request<FinanceSummary>("/subscriptions/admin/finance/summary", token),

  adminGetPayments: (token: string, limit = 50) =>
    request<SubscriptionPayment[]>(`/subscriptions/admin/finance/payments?limit=${limit}`, token),

  adminGetTotalSubscribers: (token: string) =>
    request<AdminSubscriber[]>(`/subscriptions/admin/total-subscribers`, token),
}
