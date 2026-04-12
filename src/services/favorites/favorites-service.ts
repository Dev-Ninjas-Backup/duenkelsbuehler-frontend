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

export interface FavoriteUser {
  favoriteId: number
  createdAt: string
  user: {
    id: number
    name: string
    email: string
    country: string | null
    createdAt: string
  }
}

export interface FavoritesResponse {
  userId: number
  favorites: FavoriteUser[]
}

export const favoritesService = {
  getMyFavorites: (token: string) =>
    request<FavoritesResponse>("/favorites/me", token),

  addFavorite: (targetUserId: number, token: string) =>
    request<void>(`/favorites/users/${targetUserId}`, token, { method: "POST" }),

  addFavoriteClient: (targetUserId: number, token: string) =>
    request<void>(`/favorites/clients/${targetUserId}`, token, { method: "POST" }),

  addFavoriteServiceProvider: (targetUserId: number, token: string) =>
    request<void>(`/favorites/service-providers/${targetUserId}`, token, { method: "POST" }),

  removeFavorite: (targetUserId: number, token: string) =>
    request<void>(`/favorites/${targetUserId}`, token, { method: "DELETE" }),
}
