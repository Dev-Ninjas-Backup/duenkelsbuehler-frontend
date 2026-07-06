import type {
  Banner, CreateBannerData, UpdateBannerData,
  Blog, CreateBlogData, UpdateBlogData,
  Badge, CreateBadgeData, UpdateBadgeData,
  AdminUser,
} from "@/types/admin"

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
  if (json?.meta !== undefined && json?.meta !== null) {
    return { data: json.data, meta: json.meta } as any
  }
  return (json?.data !== undefined ? json.data : json) as T
}

async function publicRequest<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

// ─── Users ───────────────────────────────────────────────────────
export const userService = {
  create: (data: { email: string; name: string; country?: string }, token: string) =>
    request<AdminUser>("/users", token, { method: "POST", body: JSON.stringify(data) }),

  findAll: (token: string) =>
    request<AdminUser[]>("/users", token),

  findOne: (id: number, token: string) =>
    request<AdminUser>(`/users/${id}`, token),

  deleteUser: (id: number, token: string) =>
    request<{ message: string }>(`/users/${id}`, token, { method: "DELETE" }),
}

// ─── Banner ──────────────────────────────────────────────────────
export const bannerService = {
  create: (data: CreateBannerData, token: string) =>
    request<Banner>("/banner/create-banner", token, { method: "POST", body: JSON.stringify(data) }),

  findAll: () =>
    publicRequest<Banner[]>("/banner"),

  findOne: (id: number) =>
    publicRequest<Banner>(`/banner/${id}`),

  update: (id: number, data: UpdateBannerData, token: string) =>
    request<Banner>(`/banner/${id}`, token, { method: "PATCH", body: JSON.stringify(data) }),

  remove: (id: number, token: string) =>
    request<void>(`/banner/${id}`, token, { method: "DELETE" }),
}

// ─── Blog ─────────────────────────────────────────────────────────
export const blogService = {
  create: (data: CreateBlogData, token: string) =>
    request<Blog>("/blog/create-blog", token, { method: "POST", body: JSON.stringify(data) }),

  findAll: () =>
    publicRequest<Blog[]>("/blog"),

  findOne: (id: number) =>
    publicRequest<Blog>(`/blog/${id}`),

  update: (id: number, data: UpdateBlogData, token: string) =>
    request<Blog>(`/blog/${id}`, token, { method: "PATCH", body: JSON.stringify(data) }),

  remove: (id: number, token: string) =>
    request<void>(`/blog/${id}`, token, { method: "DELETE" }),
}

// ─── Badge ────────────────────────────────────────────────────────
export const badgeService = {
  create: (data: CreateBadgeData, token: string) =>
    request<Badge>("/badge/create-badge", token, { method: "POST", body: JSON.stringify(data) }),

  findAll: (token: string) =>
    request<Badge[]>("/badge", token),

  findOne: (id: number, token: string) =>
    request<Badge>(`/badge/${id}`, token),

  update: (id: number, data: UpdateBadgeData, token: string) =>
    request<Badge>(`/badge/${id}`, token, { method: "PATCH", body: JSON.stringify(data) }),

  remove: (id: number, token: string) =>
    request<void>(`/badge/${id}`, token, { method: "DELETE" }),
}

// ─── Deal Management ──────────────────────────────────────────────
export const dealManagementService = {
  findAll: (
    token: string,
    params?: { page?: number; limit?: number; status?: string; isPaymented?: string; wokringStatus?: string }
  ) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.status) query.append("status", params.status);
    if (params?.isPaymented) query.append("isPaymented", params.isPaymented);
    if (params?.wokringStatus) query.append("wokringStatus", params.wokringStatus);
    const qs = query.toString();
    return request<any>(`/deal-management${qs ? `?${qs}` : ""}`, token);
  },

  findOne: (id: number, token: string) =>
    request<any>(`/deal-management/${id}`, token),
}

