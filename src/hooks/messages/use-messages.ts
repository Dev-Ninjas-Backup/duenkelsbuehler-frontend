"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "@/stores/auth/use-auth-store"
import { messagesService } from "@/services/messages/messages-service"
import type { Message, Conversation, ConversationDetail } from "@/types/messages"
import { toast } from "sonner"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""

// ─── Conversation List Hook ───────────────────────────────────────
export function useConversationList() {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    setIsLoading(true)
    messagesService.getConversationList(token)
      .then(setConversations)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token])

  return { conversations, isLoading }
}

// ─── Chat Hook (Socket.io + REST) ─────────────────────────────────
export function useChat(otherUserId: number | null) {
  const token = useAuthStore((s) => s.accessToken) ?? ""
  const currentUserId = useAuthStore((s) => s.user?.id)

  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState<ConversationDetail["otherUserProfile"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const socketRef = useRef<Socket | null>(null)

  // Load history via REST
  useEffect(() => {
    if (!token || !otherUserId) return
    setIsLoading(true)
    messagesService.getConversation(otherUserId, token)
      .then((data) => {
        setMessages(data.messages)
        setOtherUser(data.otherUserProfile)
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [token, otherUserId])

  // Socket.io connection
  useEffect(() => {
    if (!token || !otherUserId) return

    const socket = io(`${SOCKET_URL}/messages`, {
      auth: { token },
      transports: ["polling", "websocket"],
      withCredentials: true,
      extraHeaders: {
        "ngrok-skip-browser-warning": "true",
      },
    })

    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Socket connected successfully to /messages:", socket.id)
    })

    socket.on("connect_error", (err) => {
      console.error("Socket connection error on /messages:", err)
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected from /messages:", reason)
    })

    socket.on("receive_message", (msg: Message) => {
      if (
        (msg.senderId === otherUserId && msg.recipientId === currentUserId) ||
        (msg.senderId === currentUserId && msg.recipientId === otherUserId)
      ) {
        setMessages((prev) => [...prev, msg])
        // Mark as read if we are the recipient
        if (msg.recipientId === currentUserId) {
          messagesService.markAsRead(msg.id, token).catch(console.error)
        }
      }
    })

    socket.on("message_sent", (msg: Message) => {
      setMessages((prev) => {
        // avoid duplicate if already added optimistically
        if (prev.find((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })

    socket.on("url_warning", (data: { message: string; originalMessage: string }) => {
      toast.warning(data.message, {
        description: "Sharing links outside AristoPay may put your transaction at risk.",
        duration: 8000,
      })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, otherUserId, currentUserId])

  const sendMessage = useCallback(
    async (text: string, attachmentType?: "IMAGE" | "PDF") => {
      if (!otherUserId) return
      if (!text.trim() && !attachmentType) return
      setIsSending(true)
      try {
        const payload: any = { recipientId: otherUserId }
        if (attachmentType) {
          payload.attachmentUrl = text
          payload.attachmentType = attachmentType
        } else {
          payload.message = text.trim()
        }
        const sent = await messagesService.send(payload, token)
        setMessages((prev) => [...prev, sent])
      } catch (err) {
        console.error("Send failed:", err)
      } finally {
        setIsSending(false)
      }
    },
    [otherUserId, token]
  )

  return { messages, otherUser, isLoading, isSending, sendMessage }
}
