import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, AuthUser } from "@/types/auth"

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user: AuthUser) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
)
