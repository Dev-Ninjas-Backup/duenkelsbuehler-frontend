"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useChat } from "@/hooks/messages/use-messages";
import { useAuthStore } from "@/stores/auth/use-auth-store";
import type { Message } from "@/types/messages";
import { LeaveAristoPayModal } from "./_components/leave-aristopay-modal";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};
const bubbleVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

function MessageBubble({ msg, myId, otherName }: { msg: Message; myId: number; otherName: string }) {
  const isMe = msg.senderId === myId;
  return (
    <motion.div variants={bubbleVariants} initial="hidden" animate="visible" exit="exit"
      className={`relative flex w-fit min-w-[140px] max-w-[85%] md:max-w-[450px] ${isMe ? "ml-auto justify-end pr-5" : "mr-auto justify-start pl-5"}`}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
        className="relative w-full rounded-[14px] px-5 py-3.5 bg-gradient-to-br from-[#16A34A] to-[#10B981] shadow-sm z-0">
        <p className="font-work-sans text-xs font-extrabold mb-1 text-[#181D27]/90">
          {isMe ? "You" : otherName}
        </p>
        {msg.attachmentUrl ? (
          <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer"
            className="font-work-sans text-sm text-white underline">
            {msg.attachmentType === "IMAGE" ? "📷 Image" : "📄 Document"}
          </a>
        ) : (
          <p className="font-work-sans text-[14px] text-white leading-relaxed font-medium">{msg.message}</p>
        )}
        <p className="font-work-sans text-[10px] text-white/60 mt-1 text-right">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </motion.div>
      <div className={`absolute top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[#181D27] border-2 border-[#F9FAFB] shadow-sm shrink-0 z-10 flex items-center justify-center ${isMe ? "right-0" : "left-0"}`}>
        <span className="font-work-sans text-xs font-bold text-white">
          {isMe ? "Me" : otherName?.charAt(0).toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const clientId = Number(searchParams.get("clientId")) || null;
  const currentUserId = useAuthStore((s) => s.user?.id) ?? 0;

  const { messages, otherUser, isLoading, isSending, sendMessage } = useChat(clientId);
  const [input, setInput] = useState("");
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const urlRegex = /https?:\/\/[^\s]+/;
    if (urlRegex.test(trimmed)) {
      setPendingUrl(trimmed);
      setLeaveModalOpen(true);
      return;
    }
    sendMessage(trimmed);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible"
        className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-100 rounded-t-2xl">
        <div className="w-12 h-12 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
          <span className="font-rozha text-xl text-white">
            {otherUser?.name?.charAt(0).toUpperCase() ?? "?"}
          </span>
        </div>
        <div>
          <p className="font-work-sans text-base font-bold text-[#181D27]">
            {otherUser?.name ?? (isLoading ? "Loading..." : "Select a conversation")}
          </p>
          <p className="font-work-sans text-sm text-[#9CA3AF]">{otherUser?.email ?? ""}</p>
        </div>
      </motion.div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-gray-50/50">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span className="font-work-sans text-sm text-[#414651]">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="font-work-sans text-sm text-[#9CA3AF]">No messages yet. Say hello! 👋</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} myId={currentUserId} otherName={otherUser?.name ?? ""} />
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <motion.div variants={fadeIn} initial="hidden" animate="visible"
        className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex flex-col gap-3">
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Type your message here.." rows={2}
          className="w-full resize-none font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none bg-transparent" />
        <div className="flex items-center justify-end">
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.85 }}
            onClick={handleSend} disabled={!input.trim() || isSending}
            className="w-10 h-10 rounded-full bg-[#181D27] flex items-center justify-center hover:bg-[#2d3748] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message">
            <ArrowUp size={18} className="text-white" />
          </motion.button>
        </div>
      </motion.div>

      <LeaveAristoPayModal isOpen={leaveModalOpen}
        onClose={() => { setLeaveModalOpen(false); setPendingUrl(null); }}
        onLeave={() => { if (pendingUrl) window.open(pendingUrl, "_blank"); setLeaveModalOpen(false); setInput(""); setPendingUrl(null); }} />
    </div>
  );
}

export default function SPMessagesPage() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <MessagesContent />
    </Suspense>
  );
}
