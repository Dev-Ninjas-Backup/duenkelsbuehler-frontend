const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
      ...options?.headers,
    },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

export interface CreateTransactionData {
  seller_id: string
  buyer_id: string
  amount: number // in cents
  currency: string
  description?: string
  fees_buyer?: number
  fees_seller?: number
  fees_config?: number
  amount_extra?: number
  amount_postage?: number
  role?: "seller" | "buyer"
  payment_method?: "bank_transfer" | "card"
  image_url?: string
  redirect_uri?: string
}

export interface CalculateFeesData {
  amount: number
  currency: string
}

export interface FeesResponse {
  fees_buyer: number
  fees_seller: number
  fees_config: number
  currency: string
}

export interface CreateGuestUserData {
  email: string
  first_name: string
  last_name: string
  country_code: string
  tos_acceptance?: {
    unix_timestamp: number
    ip: string
  }
}

export interface TransactionResponse {
  id: string
  status: string
  paymentUrl?: string
  amount?: number
  currency?: string
  description?: string
  seller_id?: string
  buyer_id?: string
}

export const trustapService = {
  createTransaction: (data: CreateTransactionData, token: string) =>
    request<TransactionResponse>("/trustap-transactions/create", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  calculateFees: (params: CalculateFeesData, token: string) =>
    request<FeesResponse>(`/trustap-transactions/fees?amount=${params.amount}&currency=${params.currency}`, token),

  createGuestUser: (data: CreateGuestUserData, token: string) =>
    request<any>("/trustap-transactions/guest-user", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTransaction: (id: string, token: string) =>
    request<TransactionResponse>(`/trustap-transactions/${id}`, token),

  submitComplaint: (id: string, reason: string, token: string) =>
    request<unknown>(`/trustap-transactions/${id}/complaint`, token, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  getAllTransactions: (token: string, limit = 20, offset = 0) =>
    request<TransactionResponse[]>(`/trustap-transactions?limit=${limit}&offset=${offset}`, token),
}

