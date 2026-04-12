const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface UploadImageResponse {
  url: string
}

export const filesService = {
  uploadImage: async (file: File, token: string): Promise<UploadImageResponse> => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${BASE_URL}/files/upload-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json?.message || "Upload failed")
    return json?.data !== undefined ? json.data : json
  },

  uploadDocument: async (file: File, token: string): Promise<UploadImageResponse> => {
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${BASE_URL}/files/upload-document`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json?.message || "Upload failed")
    return json?.data !== undefined ? json.data : json
  },
}
