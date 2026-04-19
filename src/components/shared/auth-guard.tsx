"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import type { UserRole } from "@/types/auth"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  redirectTo: string
}

export function AuthGuard({ children, allowedRoles, redirectTo }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, role } = useAuthStore()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
      router.replace(redirectTo)
    }
  }, [hydrated, isAuthenticated, role, allowedRoles, redirectTo, router])

  // Wait for hydration
  if (!hydrated) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#181D27]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    return null
  }

  return <>{children}</>
}
