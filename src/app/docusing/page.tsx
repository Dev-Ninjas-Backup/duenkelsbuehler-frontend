"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth/use-auth-store";

// Visual config for different DocuSign callback events
const EVENT_CONFIG: Record<
  string,
  {
    statusText: string;
    title: string;
    description: string;
    gradient: string;
    iconColor: string;
    accentColor: string;
    isSuccess: boolean;
  }
> = {
  signing_complete: {
    statusText: "Success",
    title: "Signature Completed",
    description: "Your contract has been securely signed and recorded via DocuSign. The transaction is now legally protected.",
    gradient: "from-green-500/10 via-emerald-500/5 to-transparent",
    iconColor: "text-emerald-500",
    accentColor: "border-emerald-500/30 bg-emerald-50/50 text-emerald-700",
    isSuccess: true,
  },
  viewing_complete: {
    statusText: "Viewed",
    title: "Document Viewed",
    description: "You have successfully finished viewing the DocuSign contract details.",
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    iconColor: "text-blue-500",
    accentColor: "border-blue-500/30 bg-blue-50/50 text-blue-700",
    isSuccess: true,
  },
  cancel: {
    statusText: "Cancelled",
    title: "Signing Cancelled",
    description: "You cancelled the signing session. The contract remains in its previous state. You can try again anytime.",
    gradient: "from-gray-500/10 to-transparent",
    iconColor: "text-gray-400",
    accentColor: "border-gray-500/30 bg-gray-50/50 text-gray-600",
    isSuccess: false,
  },
  decline: {
    statusText: "Declined",
    title: "Document Declined",
    description: "You declined to sign this document. Please contact the other party to renegotiate terms if necessary.",
    gradient: "from-red-500/10 via-rose-500/5 to-transparent",
    iconColor: "text-red-500",
    accentColor: "border-red-500/30 bg-red-50/50 text-red-700",
    isSuccess: false,
  },
  session_timeout: {
    statusText: "Timeout",
    title: "Session Expired",
    description: "Your signing session timed out. For security, please close this page and restart the signing process.",
    gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
    iconColor: "text-amber-500",
    accentColor: "border-amber-500/30 bg-amber-50/50 text-amber-700",
    isSuccess: false,
  },
  ttl_expired: {
    statusText: "Link Expired",
    title: "Link Expired",
    description: "This secure signing link has expired. Please request a new link to complete your signature.",
    gradient: "from-amber-500/10 via-yellow-500/5 to-transparent",
    iconColor: "text-amber-500",
    accentColor: "border-amber-500/30 bg-amber-50/50 text-amber-700",
    isSuccess: false,
  },
};

const defaultErrorConfig = {
  statusText: "Error",
  title: "Process Failed",
  description: "An unexpected status or error response was received from DocuSign. Please return to your dashboard.",
  gradient: "from-red-500/10 via-rose-500/5 to-transparent",
  iconColor: "text-red-500",
  accentColor: "border-red-500/30 bg-red-50/50 text-red-700",
  isSuccess: false,
};

function DocusingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = useAuthStore((s) => s.role);

  const event = searchParams.get("event") ?? "";
  const isSuccessParam = searchParams.get("success") === "true";
  
  // Decide config based on event type or success fallback
  const config = EVENT_CONFIG[event] ?? (isSuccessParam ? EVENT_CONFIG.signing_complete : defaultErrorConfig);

  const [countdown, setCountdown] = useState(6);

  const dashboardPath =
    role === "SERVICE_PROVIDER"
      ? "/sp/my-proposals"
      : role === "CLIENT"
      ? "/client/my-proposals"
      : "/login";

  useEffect(() => {
    if (countdown <= 0) {
      router.push(dashboardPath);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, dashboardPath, router]);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-50/60 overflow-hidden px-4">
      {/* Decorative ambient background glows */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] bg-gradient-to-tr ${config.gradient} opacity-70 pointer-events-none transition-all duration-700`} />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-10 flex flex-col items-center text-center"
      >
        {/* Animated Icon Header */}
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-50 ${config.iconColor}`}
          >
            {config.isSuccess ? (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4"
                />
                <motion.circle
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.15 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  cx="12"
                  cy="12"
                  r="10"
                />
              </svg>
            ) : event === "session_timeout" || event === "ttl_expired" ? (
              <Clock className="w-11 h-11" />
            ) : (
              <XCircle className="w-11 h-11" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full border text-[9px] uppercase font-bold tracking-wider font-work-sans ${config.accentColor}`}
          >
            {config.statusText}
          </motion.div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-3.5 mb-8">
          <h1 className="font-rozha text-[32px] font-normal leading-tight text-[#181D27]">
            {config.title}
          </h1>
          <p className="font-work-sans text-sm text-[#535862] leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Info Card / Security Seal */}
        <div className="w-full bg-[#F5F5F5] rounded-2xl p-4 mb-8 flex items-center justify-between border border-gray-100">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#181D27] shadow-xs border border-gray-50">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-work-sans text-[11px] font-bold text-[#181D27] uppercase tracking-wider">AristoPay Security</p>
              <p className="font-work-sans text-xs text-[#535862]">Protected by legal escrow protocol</p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="w-full flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(dashboardPath)}
            className="w-full h-13 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-all shadow-md flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <p className="font-work-sans text-[11px] text-[#9CA3AF]">
            Auto redirecting in <span className="font-bold text-[#414651]">{countdown}s</span>...
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function DocusingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50/60">
          <div className="w-10 h-10 rounded-full border-3 border-[#181D27] border-t-transparent animate-spin" />
        </div>
      }
    >
      <DocusingContent />
    </Suspense>
  );
}
