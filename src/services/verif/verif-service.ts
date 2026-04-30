const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface VerifSessionResponse {
  sessionId: string
  sessionUrl: string
}

export const verifService = {
  createSessionOnly: async (token: string): Promise<VerifSessionResponse> => {
    const res = await fetch(`${BASE_URL}/Verif/session`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.message || "Verification failed")
    return json?.data !== undefined ? json.data : json
  },
}
