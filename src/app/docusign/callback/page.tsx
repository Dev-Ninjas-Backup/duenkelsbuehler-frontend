"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { useAuthStore } from "@/stores/auth/use-auth-store";

type DocuSignEvent =
  | "signing_complete"
  | "cancel"
  | "decline"
  | "exception"
  | "session_timeout"
  | "ttl_expired"
  | "viewing_complete"
  | string;

const EVENT_CONFIG: Record<string, { icon: React.ReactNode; title: string; message: string; color: string }> = {
  signing_complete: {
    icon: <CheckCircle2 className="w-16 h-16 text-[#16A34A]" />,
    title: "Document Signed",
    message: "Your document has been successfully signed. You can now proceed.",
    color: "text-[#16A34A]",
  },
  viewing_complete: {
    icon: <CheckCircle2 className="w-16 h-16 text-[#16A34A]" />,
    title: "Document Viewed",
    message: "You have finished viewing the document.",
    color: "text-[#16A34A]",
  },
  cancel: {
    icon: <XCircle className="w-16 h-16 text-[#9CA3AF]" />,
    title: "Signing Cancelled",
    message: "You cancelled the signing session. You can return and try again.",
    color: "text-[#9CA3AF]",
  },
  decline: {
    icon: <XCircle className="w-16 h-16 text-red-500" />,
    title: "Document Declined",
    message: "You declined to sign the document.",
    color: "text-red-500",
  },
  exception: {
    icon: <AlertCircle className="w-16 h-16 text-red-500" />,
    title: "Something Went Wrong",
    message: "An error occurred during the signing process. Please try again.",
    color: "text-red-500",
  },
  session_timeout: {
    icon: <Clock className="w-16 h-16 text-amber-500" />,
    title: "Session Timed Out",
    message: "Your signing session has expired. Please start again.",
    color: "text-amber-500",
  },
  ttl_expired: {
    icon: <Clock className="w-16 h-16 text-amber-500" />,
    title: "Link Expired",
    message: "This signing link has expired. Please request a new one.",
    color: "text-amber-500",
  },
};

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = useAuthStore((s) => s.role);

  const event = (searchParams.get("event") ?? "exception") as DocuSignEvent;
  const envelopeId = searchParams.get("envelopeId");

  const config = EVENT_CONFIG[event] ?? {
    icon: <AlertCircle className="w-16 h-16 text-red-500" />,
    title: "Unknown Status",
    message: "An unexpected response was received from DocuSign.",
    color: "text-red-500",
  };

  const [countdown, setCountdown] = useState(5);

  const dashboardPath =
    role === "SERVICE_PROVIDER"
      ? "/sp/my-proposals"
      : role === "CLIENT"
      ? "/client/my-proposals"
      : "/login";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(dashboardPath);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [dashboardPath, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 max-w-sm w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          {config.icon}
        </motion.div>

        <div className="flex flex-col gap-2">
          <h1 className={`font-rozha text-3xl ${config.color}`}>{config.title}</h1>
          <p className="font-work-sans text-sm text-[#414651] leading-relaxed">{config.message}</p>
          {envelopeId && (
            <p className="font-work-sans text-xs text-[#9CA3AF] mt-1">
              Envelope ID: {envelopeId}
            </p>
          )}
        </div>

        <p className="font-work-sans text-xs text-[#9CA3AF]">
          Redirecting in {countdown}s...
        </p>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push(dashboardPath)}
          className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Go to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function DocuSignCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#181D27] border-t-transparent animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
