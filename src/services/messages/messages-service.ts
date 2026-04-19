import type { Message, Conversation, ConversationDetail, SendMessageData } from "@/types/messages"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function request<T>(endpoint: string, token: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    ...options,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || "Something went wrong")
  return (json?.data !== undefined ? json.data : json) as T
}

export const messagesService = {
  send: (data: SendMessageData, token: string) =>
    request<Message>("/messages/send", token, { method: "POST", body: JSON.stringify(data) }),

  getConversationList: (token: string, limit = 50) =>
    request<Conversation[]>(`/messages/conversation?limit=${limit}`, token),

  getConversation: (otherUserId: number, token: string, limit = 50) =>
    request<ConversationDetail>(`/messages/conversation/${otherUserId}?limit=${limit}`, token),

  markAsRead: (messageId: string, token: string) =>
    request<Message>(`/messages/${messageId}/read`, token, { method: "PATCH" }),
}
