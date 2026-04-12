"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "@/stores/auth/use-auth-store"

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""

export interface TransactionEvent {
  id: number
  trustapTransactionId: string
  amount: number
  currency: string
  description: string
  status: string
  buyer: { id: number; email: string; name: string }
  seller: { id: number; email: string; name: string }
}

interface UseTrustapSocketOptions {
  onTransactionCreated?: (tx: TransactionEvent) => void
  onTransactionUpdated?: (tx: TransactionEvent) => void
}

export function useTrustapSocket({ onTransactionCreated, onTransactionUpdated }: UseTrustapSocketOptions = {}) {
  const token = useAuthStore((s) => s.accessToken)
  const socketRef = useRef<Socket | null>(null)

  const subscribeToTransaction = useCallback((transactionId: string) => {
    socketRef.current?.emit("subscribe_transaction", { transactionId })
  }, [])

  useEffect(() => {
    if (!token) return

    const socket = io(`${SOCKET_URL}/transactions`, {
      auth: { token },
      transports: ["websocket"],
    })

    socketRef.current = socket

    socket.on("transaction_created", (tx: TransactionEvent) => {
      onTransactionCreated?.(tx)
    })

    socket.on("any_transaction_created", (tx: TransactionEvent) => {
      onTransactionCreated?.(tx)
    })

    socket.on("transaction_updated", (tx: TransactionEvent) => {
      onTransactionUpdated?.(tx)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [token, onTransactionCreated, onTransactionUpdated])

  return { subscribeToTransaction }
}
