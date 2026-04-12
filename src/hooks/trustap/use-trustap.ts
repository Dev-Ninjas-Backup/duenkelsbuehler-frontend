import { useMutation, useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { trustapService, CreateTransactionData } from "@/services/trustap/trustap-service"

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? ""
}

export function useCreateTransaction() {
  const token = useToken()
  return useMutation({
    mutationFn: (data: CreateTransactionData) =>
      trustapService.createTransaction(data, token),
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

export function useRefundTransaction() {
  const token = useToken()
  return useMutation({
    mutationFn: ({ id, sellerId }: { id: string; sellerId: string }) =>
      trustapService.refundTransaction(id, sellerId, token),
  })
}

export function useRefundF2FTransaction() {
  const token = useToken()
  return useMutation({
    mutationFn: (id: string) => trustapService.refundF2FTransaction(id, token),
  })
}

export function useAllTransactions(ids: string[]) {
  const token = useToken()
  return useQuery({
    queryKey: ["all-transactions", ids],
    queryFn: () => trustapService.getAllTransactions(ids, token),
    enabled: ids.length > 0 && !!token,
  })
}

export function useBalance() {
  const token = useToken()
  return useQuery({
    queryKey: ["trustap-balance"],
    queryFn: () => trustapService.getBalance(token),
    enabled: !!token,
  })
}
