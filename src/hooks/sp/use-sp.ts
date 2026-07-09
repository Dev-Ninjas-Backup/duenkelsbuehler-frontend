import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { serviceItemService, serviceProviderService, proposalService, CreateDirectProposalData } from "@/services/sp/sp-service"
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

export function useAllServiceItems(params?: { name?: string; industry?: string; location?: string; page?: number; limit?: number }) {
  const token = useToken()
  return useQuery({
    queryKey: ["service-items", "all", params],
    queryFn: () => serviceItemService.findAll(token, params),
    enabled: !!token,
  })
}

export function useServiceItem(id: number | null) {
  const token = useToken()
  return useQuery({
    queryKey: ["service-item", id],
    queryFn: () => serviceItemService.findOne(id!, token),
    enabled: !!id && !!token,
  })
}

export function useCreateServiceItem() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateServiceItemData) => serviceItemService.create(data, token),
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

export function useServiceProviderProfileByUserId(userId: number | null) {
  const token = useToken()
  return useQuery({
    queryKey: ["service-provider-profile", userId],
    queryFn: () => serviceProviderService.findByUserId(userId!, token),
    enabled: !!userId && !!token,
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

export function useSendDirectProposal() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ providerId, data }: { providerId: number; data: CreateDirectProposalData }) =>
      proposalService.sendDirectProposal(providerId, data, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-proposals"] })
      qc.invalidateQueries({ queryKey: ["my-sent-proposals"] })
      qc.invalidateQueries({ queryKey: ["my-badges"] })
    }
  })
}

export function useMySentProposals() {
  const token = useToken()
  return useQuery({
    queryKey: ["my-sent-proposals"],
    queryFn: () => proposalService.getMySentProposals(token),
    enabled: !!token,
  })
}

export function useClientReceivedProposals() {
  const token = useToken()
  return useQuery({
    queryKey: ["client-received-proposals"],
    queryFn: () => proposalService.getClientReceivedProposals(token),
    enabled: !!token,
  })
}

export function useReceivedProposals() {
  const token = useToken()
  return useQuery({
    queryKey: ["received-proposals"],
    queryFn: () => proposalService.getReceivedProposals(token),
    enabled: !!token,
  })
}

export function useAcceptProposal() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: number) => proposalService.acceptProposal(proposalId, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["received-proposals"] })
    },
  })
}

export function useDeclineProposal() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (proposalId: number) => proposalService.declineProposal(proposalId, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["received-proposals"] })
    },
  })
}

export function useDocusignRequests() {
  const token = useToken()
  return useQuery({
    queryKey: ["docusign-requests"],
    queryFn: () => proposalService.getDocusignRequests(token),
    enabled: !!token,
  })
}

export function useUploadAndSendDocusign() {
  const token = useToken()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => proposalService.uploadAndSendDocusign(formData, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["docusign-requests"] })
      qc.invalidateQueries({ queryKey: ["received-proposals"] })
      qc.invalidateQueries({ queryKey: ["my-sent-proposals"] })
      qc.invalidateQueries({ queryKey: ["my-badges"] })
    },
  })
}

export function useDocusignSignUrl() {
  const token = useToken()
  return useMutation({
    mutationFn: (documentId: string) => proposalService.getDocusignSignUrl(documentId, token),
  })
}

export function useProviderServiceItems(providerId: number | null) {
  const token = useToken()
  return useQuery({
    queryKey: ["provider-service-items", providerId],
    queryFn: () => proposalService.getProviderServiceItems(providerId!, token),
    enabled: !!providerId && !!token,
  })
}
