const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

export interface ClientUser {
  id: number
  name: string
  email: string
  country: string | null
  isIdentityVerified: boolean
  role: string[]
  createdAt: string
}

export const usersService = {
  findAll: (token: string) =>
    request<ClientUser[]>("/users", token),
}
