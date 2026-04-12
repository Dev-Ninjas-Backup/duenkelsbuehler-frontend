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

export interface CreateTransactionData {
  seller_id: string
  buyer_id: string
  creator_role: "seller" | "buyer"
  currency: string
  description: string
  price: number
  charge: number
  charge_calculator_version: number
  image_url: string
  serviceId?: number
  metadata?: Record<string, any>
}

export interface TransactionResponse {
  id: string
  status: string
  paymentUrl?: string
  dbTransaction?: {
    id: number
    trustapTransactionId: string
    amount: number
    currency: string
    description: string
    status: string
    buyer: { id: number; email: string; name: string }
    seller: { id: number; email: string; name: string }
  }
}

export const trustapService = {
  createTransaction: (data: CreateTransactionData, token: string) =>
    request<TransactionResponse>("/trustap/create-transaction", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTransaction: (id: string, token: string) =>
    request<TransactionResponse>(`/trustap/transaction/${id}`, token),

  refundTransaction: (id: string, sellerId: string, token: string) =>
    request<unknown>(`/trustap/transaction/refund/${id}?seller_id=${sellerId}`, token, {
      method: "PATCH",
    }),

  refundF2FTransaction: (id: string, token: string) =>
    request<unknown>(`/trustap/transaction/refund-f2f/${id}`, token, {
      method: "PATCH",
    }),

  getAllTransactions: (ids: string[], token: string) =>
    request<unknown[]>(`/trustap/all-transactions?ids=${ids.join(",")}`, token),

  getBalance: (token: string) =>
    request<unknown>("/trustap/balence", token),
}
