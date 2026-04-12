import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, AuthUser, UserRole } from "@/types/auth"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      role: null,
      isAuthenticated: false,
      setAuth: (user: AuthUser, accessToken: string, role: UserRole) =>
        set({ user, accessToken, role, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, role: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
)
