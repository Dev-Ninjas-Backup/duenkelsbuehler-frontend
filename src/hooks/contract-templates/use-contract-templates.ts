import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import { contractTemplatesService, SendFromTemplateData } from "@/services/contract-templates/contract-templates-service";

function useToken() {
  return useAuthStore((s) => s.accessToken) ?? "";
}

export function useMyTemplates() {
  const token = useToken();
  return useQuery({
    queryKey: ["contract-templates", "my"],
    queryFn: () => contractTemplatesService.getMyTemplates(token),
    enabled: !!token,
  });
}

export function useUploadTemplate() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => contractTemplatesService.upload(formData, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contract-templates", "my"] });
    },
  });
}

export function useDeleteTemplate() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contractTemplatesService.delete(id, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contract-templates", "my"] });
    },
  });
}

export function useSendFromTemplate() {
  const token = useToken();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SendFromTemplateData) => contractTemplatesService.send(data, token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["docusign-requests"] });
      qc.invalidateQueries({ queryKey: ["received-proposals"] });
      qc.invalidateQueries({ queryKey: ["my-sent-proposals"] });
      qc.invalidateQueries({ queryKey: ["my-badges"] });
    },
  });
}
