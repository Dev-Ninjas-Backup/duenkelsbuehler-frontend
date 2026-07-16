import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthState, AuthUser, UserRole } from "@/types/auth"
import { useState, useEffect } from "react"

const useAuthStoreRaw = create<AuthState>()(
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
      updateUser: (updatedUser: Partial<AuthUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
    }),
    { name: "auth-storage" }
  )
)

const getInitialState = (): AuthState => ({
  user: null,
  accessToken: null,
  role: null,
  isAuthenticated: false,
  setAuth: useAuthStoreRaw.getState().setAuth,
  clearAuth: useAuthStoreRaw.getState().clearAuth,
  updateUser: useAuthStoreRaw.getState().updateUser,
})

// Wrapper hook logic that prevents hydration mismatch
const useAuthStoreHook = <U>(selector?: (state: AuthState) => U): U | AuthState => {
  const store = useAuthStoreRaw();
  const [state, setState] = useState(() => {
    const initial = getInitialState();
    return selector ? selector(initial) : initial;
  });

  const selectedState = selector ? selector(store) : store;

  useEffect(() => {
    setState(selectedState);
  }, [selectedState]);

  return state;
};

// Copy all static utility properties (setState, getState, subscribe, etc.)
Object.assign(useAuthStoreHook, useAuthStoreRaw);

// Export casted as the original Zustand store hook type
export const useAuthStore = useAuthStoreHook as unknown as typeof useAuthStoreRaw;
