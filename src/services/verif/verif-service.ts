const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface VerifSessionResponse {
  success: boolean
  sessionId: string
  userId: number
  verificationUrl: string
  media: unknown
}

export const verifService = {
  createSession: async (file: File, token: string): Promise<VerifSessionResponse> => {
    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(`${BASE_URL}/Verif/create-session`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    const json = await res.json()
    if (!res.ok) throw new Error(json?.message || "Verification failed")
    return json?.data !== undefined ? json.data : json
  },
}
