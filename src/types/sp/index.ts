// ─── Service Item ─────────────────────────────────────────────────
export interface ServiceItem {
  id: number
  description: string
  industry: string
  location: string
  createdAt: string
  updatedAt: string
}

export interface CreateServiceItemData {
  description: string
  industry: string
  location: string
}

export interface UpdateServiceItemData {
  description?: string
  industry?: string
  location?: string
}

// ─── Service Provider Profile ─────────────────────────────────────
export interface ServiceProvider {
  id: number
  Fullname: string
  occupation: string
  description: string
  location: string
  phoneNumber: string
  payementDetails: string
  userId: number
  isVerifiedFromAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateServiceProviderData {
  Fullname: string
  occupation: string
  description: string
  location: string
  phoneNumber: string
  payementDetails: string
}
