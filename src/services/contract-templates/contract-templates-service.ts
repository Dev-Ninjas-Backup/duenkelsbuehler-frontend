const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  raw?: boolean;
}

async function request<T>(endpoint: string, token: string, options?: RequestOptions): Promise<T> {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
    ...options?.headers,
  };

  if (!(options?.body instanceof FormData) && !headers.hasOwnProperty("Content-Type")) {
    (headers as any)["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return {} as T;
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Something went wrong");
  if (options?.raw) return json as T;
  return (json?.data !== undefined ? json.data : json) as T;
}

export interface ContractTemplate {
  id: number;
  dbId: string;
  title: string;
  description: string | null;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface SendFromTemplateData {
  templateId: number;
  title?: string;
  clientId?: number;
  providerId?: number;
  proposalId?: number;
}

export interface SendFromTemplateResponse {
  id: number;
  dbId: string;
  title: string;
  envelopeId: string;
  providerId: number;
  clientId: number;
  senderRole: "PROVIDER" | "CLIENT";
  senderStatus: string;
  receiverStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  usedTemplate: {
    id: number;
    title: string;
    originalName: string;
  };
  overageWarning?: string;
}

export const contractTemplatesService = {
  upload: (formData: FormData, token: string) =>
    request<ContractTemplate>("/contract-templates/upload", token, {
      method: "POST",
      body: formData,
    }),

  getMyTemplates: (token: string) =>
    request<ContractTemplate[]>("/contract-templates/my", token),

  getTemplate: (id: number, token: string) =>
    request<ContractTemplate>(`/contract-templates/${id}`, token),

  download: async (id: number, token: string): Promise<Blob> => {
    const res = await fetch(`${BASE_URL}/contract-templates/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json?.message || "Download failed");
    }
    return res.blob();
  },

  delete: (id: number, token: string) =>
    request<{ message: string }>(`/contract-templates/${id}`, token, {
      method: "DELETE",
    }),

  send: (data: SendFromTemplateData, token: string) =>
    request<SendFromTemplateResponse>("/contract-templates/send", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
