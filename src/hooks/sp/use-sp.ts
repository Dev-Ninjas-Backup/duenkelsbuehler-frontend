import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { serviceItemService, serviceProviderService } from "@/services/sp/sp-service"
import type { CreateServiceItemData, UpdateServiceItemData, CreateServiceProviderData } from "@/types/sp"

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? ""
}

// ─── Service Items ────────────────────────────────────────────────
export function useServiceItems() {
  const token = useToken()
  return useQuery({
    queryKey: ["service-items", "my"],
    queryFn: () => serviceItemService.findMy(token),
    enabled: !!token,
  })
}

export function useCreateServiceItem() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateServiceItemData) => {
      // Auto-ensure SP profile exists before creating service
      // Backend returns 409 Conflict if already exists — safe to ignore
      await serviceProviderService.create({
        Fullname: "Service Provider",
        occupation: "Service Provider",
        description: "Service Provider",
        location: "-",
        phoneNumber: "-",
        payementDetails: "-",
      }, token).catch(() => {})
      return serviceItemService.create(data, token)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["service-items", "my"] }),
  })
}

export function useUpdateServiceItem() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateServiceItemData }) =>
      serviceItemService.update(id, data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["service-items", "my"] }),
  })
}

export function useDeleteServiceItem() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => serviceItemService.remove(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["service-items", "my"] }),
  })
}

// ─── Service Provider Profile ─────────────────────────────────────
export function useCreateServiceProvider() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServiceProviderData) => serviceProviderService.create(data, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["service-provider"] }),
  })
}

export function useAllServiceProviders() {
  const token = useToken()
  return useQuery({
    queryKey: ["service-provider"],
    queryFn: () => serviceProviderService.findAll(token),
    enabled: !!token,
  })
}

export function useServiceProvider(id: number | null) {
  const token = useToken()
  return useQuery({
    queryKey: ["service-provider", id],
    queryFn: () => serviceProviderService.findOne(id!, token),
    enabled: !!id && !!token,
  })
}

export function useAdminVerifyServiceProvider() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => serviceProviderService.adminVerify(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["service-provider"] }),
  })
}

export function useDeleteServiceProvider() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => serviceProviderService.remove(id, token),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["service-provider"] }),
  })
}
