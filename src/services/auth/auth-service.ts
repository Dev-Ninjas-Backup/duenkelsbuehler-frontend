import type { LoginFormData, SignUpFormData, AuthUser } from "@/types/auth"

// TODO: Replace with actual API base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export const authService = {
  login: async (data: LoginFormData): Promise<AuthUser> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  },

  loginWithGoogle: async (): Promise<void> => {
    // TODO: Implement Google OAuth
    window.location.href = `${API_BASE_URL}/auth/google`
  },

  loginWithApple: async (): Promise<void> => {
    // TODO: Implement Apple OAuth
    window.location.href = `${API_BASE_URL}/auth/apple`
  },

  register: async (data: SignUpFormData): Promise<AuthUser> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const contentType = response.headers.get("content-type")
      if (!contentType?.includes("application/json")) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  },
}
