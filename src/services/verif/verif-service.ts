const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export interface VerifSessionResponse {
  url: string
}

export interface CreateVerifSessionData {
  verification: {
    callback: string
    person: {
      firstName: string
      lastName: string
      email: string
      idNumber: string
      dateOfBirth: string
      gender: string
    }
    document: {
      number: string
      type: "PASSPORT" | "ID_CARD" | "DRIVERS_LICENSE" | "RESIDENCE_PERMIT"
      country: string
    }
  }
}

export const verifService = {
  createSession: async (data: CreateVerifSessionData, token: string): Promise<VerifSessionResponse> => {
    const res = await fetch(`${BASE_URL}/veriff/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json?.message || "Verification failed")
    return json?.data !== undefined ? json.data : json
  },
}
