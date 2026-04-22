import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { subscriptionService, CreatePlanData, UpdatePlanData } from "@/services/subscription/subscription-service"

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? ""
}

// ─── Public ───────────────────────────────────────────────────────
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: () => subscriptionService.getPlans(),
  })
}

// ─── User ─────────────────────────────────────────────────────────
export function useMySubscriptions() {
  const token = useToken()
  return useQuery({
    queryKey: ["my-subscriptions"],
    queryFn: () => subscriptionService.getMySubscriptions(token),
    enabled: !!token,
  })
}

export function useCreateCheckoutSession() {
  const token = useToken()
  return useMutation({
    mutationFn: (data: { planId: number; successUrl: string; cancelUrl: string }) =>
      subscriptionService.createCheckoutSession(data, token),
  })
}

export function useCancelSubscription() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (subscriptionId: number) =>
      subscriptionService.cancelSubscription(subscriptionId, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-subscriptions"] }),
  })
}

export function useCreateCustomPlan() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePlanData) =>
      subscriptionService.createCustomPlan(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscription-plans"] }),
  })
}

// ─── Admin ────────────────────────────────────────────────────────
export function useAdminCreatePlan() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePlanData) =>
      subscriptionService.adminCreatePlan(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-plans"] }),
  })
}

export function useAdminPlans() {
  const token = useToken()
  return useQuery({
    queryKey: ["admin-plans"],
    queryFn: () => subscriptionService.adminGetPlans(token),
    enabled: !!token,
  })
}

export function useAdminUpdatePlan() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ planId, data }: { planId: number; data: UpdatePlanData }) =>
      subscriptionService.adminUpdatePlan(planId, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-plans"] }),
  })
}

export function useAdminFinanceSummary() {
  const token = useToken()
  return useQuery({
    queryKey: ["admin-finance-summary"],
    queryFn: () => subscriptionService.adminGetFinanceSummary(token),
    enabled: !!token,
  })
}

export function useAdminPayments(limit = 50) {
  const token = useToken()
  return useQuery({
    queryKey: ["admin-payments", limit],
    queryFn: () => subscriptionService.adminGetPayments(token, limit),
    enabled: !!token,
  })
}
