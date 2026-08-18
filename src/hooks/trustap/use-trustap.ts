import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import {
  trustapService,
  CreateTransactionData,
  CalculateFeesData,
  CreateGuestUserData,
} from "@/services/trustap/trustap-service"

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? ""
}

export function useCreateTransaction() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTransactionData) =>
      trustapService.createTransaction(data, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-badges"] })
      qc.invalidateQueries({ queryKey: ["all-transactions"] })
    },
  })
}

export function useCalculateFees() {
  const token = useToken()
  return useMutation({
    mutationFn: (data: CalculateFeesData) =>
      trustapService.calculateFees(data, token),
  })
}

export function useCreateGuestUser() {
  const token = useToken()
  return useMutation({
    mutationFn: (data: CreateGuestUserData) =>
      trustapService.createGuestUser(data, token),
  })
}

export function useGetTransaction(id: string | null) {
  const token = useToken()
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => trustapService.getTransaction(id!, token),
    enabled: !!id && !!token,
  })
}

export function useSubmitComplaint() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      trustapService.submitComplaint(id, reason, token),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["transaction", variables.id] })
    },
  })
}

export function useAllTransactions(limit = 20, offset = 0) {
  const token = useToken()
  return useQuery({
    queryKey: ["all-transactions", limit, offset],
    queryFn: () => trustapService.getAllTransactions(token, limit, offset),
    enabled: !!token,
  })
}

