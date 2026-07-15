import type {
  ServiceItem, CreateServiceItemData, UpdateServiceItemData,
  ServiceProvider, CreateServiceProviderData,
} from "@/types/sp"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface RequestOptions extends RequestInit {
  raw?: boolean
}

async function request<T>(endpoint: string, token: string, options?: RequestOptions): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
    ...options?.headers,
  }

  if (!(options?.body instanceof FormData) && !headers.hasOwnProperty("Content-Type")) {
    (headers as any)["Content-Type"] = "application/json"
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  if (options?.raw) return json as T
  return (json?.data !== undefined ? json.data : json) as T
}

// ─── Service Items ────────────────────────────────────────────────
export const serviceItemService = {
  create: (data: CreateServiceItemData, token: string) =>
    request<ServiceItem>("/services/provider/create", token, { method: "POST", body: JSON.stringify(data) }),

  findAll: (
    token: string,
    params?: { name?: string; industry?: string; location?: string; page?: number; limit?: number }
  ) => {
    const query = new URLSearchParams()
    if (params?.name) query.append("name", params.name)
    if (params?.industry) query.append("industry", params.industry)
    if (params?.location) query.append("location", params.location)
    if (params?.page) query.append("page", String(params.page))
    if (params?.limit) query.append("limit", String(params.limit))
    const qs = query.toString()
    return request<any>(`/services/all-services${qs ? `?${qs}` : ""}`, token)
  },

  findMy: (token: string) =>
    request<ServiceItem[]>("/services/my", token),

  findOne: (id: number, token: string) =>
    request<ServiceItem>(`/services/${id}`, token),

  update: (id: number, data: UpdateServiceItemData, token: string) =>
    request<ServiceItem>(`/services/${id}`, token, { method: "PATCH", body: JSON.stringify(data) }),

  remove: (id: number, token: string) =>
    request<void>(`/services/${id}`, token, { method: "DELETE" }),
}

// ─── Service Provider Profile ─────────────────────────────────────
export const serviceProviderService = {
  create: (data: CreateServiceProviderData, token: string) =>
    request<ServiceProvider>("/service-provider/create-service-provider", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  findAll: (token: string) =>
    request<ServiceProvider[]>("/service-provider/all-service-providers", token),

  findOne: (id: number, token: string) =>
    request<ServiceProvider>(`/service-provider/${id}`, token),

  findByUserId: (userId: number, token: string) =>
    request<ServiceProvider>(`/service-provider/user/${userId}`, token),

  adminVerify: (id: number, token: string) =>
    request<ServiceProvider>(`/service-provider/service-providers/${id}`, token, {
      method: "PATCH",
    }),

  remove: (id: number, token: string) =>
    request<void>(`/service-provider/${id}`, token, { method: "DELETE" }),
}

export interface CreateDirectProposalData {
  proposalTitle: string;
  serviceDescription: string;
  selectedServiceItemIds?: number[];
  issueDate: string;
  dueDate: string;
  proposedPrice: number;
  currency: string;
  paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  notes?: string;
  terms?: string;
}

export const proposalService = {
  getProviderServiceItems: (providerId: number, token: string) =>
    request<{ serviceItems: any[] }>(`/services/${providerId}/service-items`, token),

  sendDirectProposal: (providerId: number, data: CreateDirectProposalData, token: string) =>
    request<any>(`/services/${providerId}/send-proposal`, token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getMySentProposals: (token: string) =>
    request<any[]>("/services/proposals/my-sent", token),
  getClientReceivedProposals: (token: string) =>
    request<any[]>("/services/proposals/client-received", token),
  getReceivedProposals: (token: string) =>
    request<any[]>("/services/proposals/received", token),
  acceptProposal: (proposalId: number, token: string) =>
    request<any>(`/services/proposals/${proposalId}/accept`, token, { method: "PATCH" }),
  declineProposal: (proposalId: number, token: string) =>
    request<any>(`/services/proposals/${proposalId}/decline`, token, { method: "PATCH" }),
  uploadAndSendDocusign: (formData: FormData, token: string) =>
    request<any>("/docusign_2/create", token, {
      method: "POST",
      body: formData,
    }),
  getDocusignSignUrl: (documentId: string, token: string) =>
    request<{ url: string }>(`/docusign_2/sign-url/${documentId}`, token),
  getDocusignRequests: (token: string) =>
    request<any[]>("/docusign_2/my-requests", token),

  // SP to Client (Option A) new endpoints
  searchClients: (search: string, page: number, limit: number, token: string) =>
    request<{ data: any[]; meta: any }>(`/services/sp/search-clients?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`, token, { raw: true }),
  sendSPProposal: (clientId: number, data: any, token: string) =>
    request<any>(`/services/sp/send-proposal/${clientId}`, token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getSPSentProposals: (token: string) =>
    request<any[]>("/services/sp/proposals/sent", token),
  getClientReceivedSPProposals: (token: string) =>
    request<any[]>("/services/proposals/sp-received", token),
  clientAcceptSPProposal: (proposalId: number, token: string) =>
    request<any>(`/services/proposals/${proposalId}/client-accept`, token, { method: "PATCH" }),
  clientDeclineSPProposal: (proposalId: number, token: string) =>
    request<any>(`/services/proposals/${proposalId}/client-decline`, token, { method: "PATCH" }),
}
