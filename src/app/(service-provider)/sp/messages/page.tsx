"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, ArrowUp } from "lucide-react";
import { LeaveAristoPayModal } from "./_components/leave-aristopay-modal";

interface Message {
  id: number;
  sender: "me" | "them";
  text: string;
  image?: string;
}

const CONTACT = {
  name: "Maria Gonzalez Castillo",
  handle: "@Vanessa92",
  avatar: "/images/logo/Logo2.png",
};

const MY_AVATAR = "/images/logo/Logo2.png";

const INITIAL_MESSAGES: Message[] = [
  { id: 1, sender: "me", text: "Tell us nowww 🤩🤩🤩" },
  { id: 2, sender: "them", text: "Tell us nowww 🤩🤩🤩" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check if message contains a URL
    const urlRegex = /https?:\/\/[^\s]+/;
    if (urlRegex.test(trimmed)) {
      setPendingUrl(trimmed);
      setLeaveModalOpen(true);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: trimmed },
    ]);
    setInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "me", text: "", image: url },
    ]);
    e.target.value = "";
  };

  const handleLeave = () => {
    if (pendingUrl) window.open(pendingUrl, "_blank");
    setLeaveModalOpen(false);
    setInput("");
    setPendingUrl(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-100 rounded-t-2xl">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
          <Image
            src={CONTACT.avatar}
            alt={CONTACT.name}
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="font-work-sans text-base font-bold text-[#181D27]">
            {CONTACT.name}
          </p>
          <p className="font-work-sans text-sm text-[#9CA3AF]">
            {CONTACT.handle}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 bg-gray-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-2.5 ${msg.sender === "me" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0 mb-1">
                <Image
                  src={msg.sender === "me" ? MY_AVATAR : CONTACT.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Bubble */}
              <div
                className={`max-w-xs lg:max-w-sm rounded-2xl px-4 py-3 bg-[#2E7D32] ${
                  msg.sender === "me" ? "rounded-br-sm" : "rounded-bl-sm"
                }`}
              >
                <p
                  className={`font-work-sans text-xs font-bold mb-1 text-white ${msg.sender === "them" ? "" : ""}`}
                >
                  {msg.sender === "me" ? "You" : CONTACT.name}
                </p>
                {msg.image ? (
                  <Image
                    src={msg.image}
                    alt="uploaded"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <p className="font-work-sans text-sm text-white leading-relaxed">
                    {msg.text}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border border-gray-200 rounded-2xl mx-0 mb-0 px-5 py-4 flex flex-col gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message here.."
          rows={2}
          className="w-full resize-none font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none bg-transparent"
        />
        <div className="flex items-center justify-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-full bg-[#181D27] flex items-center justify-center hover:bg-[#2d3748] transition-colors"
            aria-label="Upload image"
          >
            <ImagePlus size={18} className="text-white" />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#181D27] flex items-center justify-center hover:bg-[#2d3748] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <ArrowUp size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Leave AristoPay modal */}
      <LeaveAristoPayModal
        isOpen={leaveModalOpen}
        onClose={() => {
          setLeaveModalOpen(false);
          setPendingUrl(null);
        }}
        onLeave={handleLeave}
      />
    </div>
  );
}
