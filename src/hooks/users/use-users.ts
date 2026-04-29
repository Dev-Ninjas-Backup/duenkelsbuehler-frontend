import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { usersService } from "@/services/users/users-service"

export function useClients() {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const all = await usersService.findAll(token)
      return all.filter((u) => u.role?.includes("CLIENT"))
    },
    enabled: !!token,
  })
}
