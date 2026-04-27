import type {
  Banner, CreateBannerData, UpdateBannerData,
  Blog, CreateBlogData, UpdateBlogData,
  Badge, CreateBadgeData, UpdateBadgeData,
  AdminUser,
} from "@/types/admin"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...options,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

async function publicRequest<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
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
