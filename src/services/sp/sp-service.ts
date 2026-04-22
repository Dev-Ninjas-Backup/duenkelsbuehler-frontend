import type {
  ServiceItem, CreateServiceItemData, UpdateServiceItemData,
  ServiceProvider, CreateServiceProviderData,
} from "@/types/sp"

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

// ─── Service Items ────────────────────────────────────────────────
export const serviceItemService = {
  create: (data: CreateServiceItemData, token: string) =>
    request<ServiceItem>("/services", token, { method: "POST", body: JSON.stringify(data) }),

  findAll: (token: string) =>
    request<ServiceItem[]>("/services", token),

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

  adminVerify: (id: number, token: string) =>
    request<ServiceProvider>(`/service-provider/service-providers/${id}`, token, {
      method: "PATCH",
    }),

  remove: (id: number, token: string) =>
    request<void>(`/service-provider/${id}`, token, { method: "DELETE" }),
}
