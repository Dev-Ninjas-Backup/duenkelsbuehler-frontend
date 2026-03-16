export interface LoginFormData {
  identifier: string
  password: string
}

export interface SignUpFormData {
  username: string
  email: string
  password: string
  role: "service_provider" | "client"
  acceptTerms: boolean
}

export interface AuthUser {
  id: string
  email: string
  username: string
  token: string
  role: "service_provider" | "client" | "admin"
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser) => void
  clearUser: () => void
}
