export interface UserProfile {
  id: number
  name: string
  email: string
  country: string | null
}

export interface Message {
  id: string
  senderId: number
  recipientId: number
  message: string
  attachmentType: string | null
  attachmentUrl: string | null
  read: boolean
  createdAt: string
  senderProfile?: UserProfile
  recipientProfile?: UserProfile
}

export interface Conversation {
  otherUserId: number
  otherUserProfile: UserProfile
  lastMessage: Omit<Message, "senderProfile" | "recipientProfile">
}

export interface ConversationDetail {
  otherUserProfile: UserProfile
  messages: Message[]
}

export interface SendMessageData {
  recipientId: number
  message?: string
  attachmentUrl?: string
  attachmentType?: "IMAGE" | "PDF"
}
