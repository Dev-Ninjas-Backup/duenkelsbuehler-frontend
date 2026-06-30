"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Calendar, DollarSign, Send, User, X, AlertCircle } from "lucide-react";
import { useReceivedProposals, useAcceptProposal, useDeclineProposal } from "@/hooks/sp/use-sp";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  email: string;
  country: string | null;
  role: string[];
}

interface ServiceProposal {
  id: number;
  proposalTitle: string;
  serviceDescription: string | null;
  issueDate: string;
  dueDate: string;
  proposedPrice: number;
  currency: string;
  paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  notes: string | null;
  terms: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  client: Client;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

function StatusBadge({ status }: { status: ServiceProposal["status"] }) {
  let bg = "bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]";
  let dot = "bg-[#F59E0B]";
  let label = "Pending";

  if (status === "ACCEPTED") {
    bg = "bg-[#D1FAE5] text-[#059669] border-[#A7F3D0]";
    dot = "bg-[#10B981]";
    label = "Accepted";
  } else if (status === "REJECTED") {
    bg = "bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]";
    dot = "bg-[#EF4444]";
    label = "Rejected";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function ProposalDetailsModal({
  proposal,
  onClose,
  onAccept,
  onDecline,
  isActionPending,
}: {
  proposal: ServiceProposal;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  isActionPending: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "TRUST_APP":
        return "Trust App";
      case "BANK_TRANSFER":
        return "Bank Transfer";
      case "CARD":
        return "Credit/Debit Card";
      default:
        return method;
    }
  };

  if (!mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[999] flex justify-end overflow-hidden">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs"
      />

      {/* Slide-over panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        className="relative w-full sm:max-w-lg h-full bg-white shadow-2xl z-[1000] flex flex-col p-6 sm:p-8 overflow-y-auto rounded-l-[30px] border-l border-gray-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        {/* Title & Info */}
        <div className="mb-6 pr-8 mt-4">
          <div className="mb-2">
            <StatusBadge status={proposal.status} />
          </div>
          <h2 className="font-rozha text-2xl sm:text-3xl text-[#181D27] leading-tight">
            {proposal.proposalTitle}
          </h2>
          <p className="font-work-sans text-xs text-gray-400 mt-1">
            Received on {formatDate(proposal.createdAt)}
          </p>
        </div>

        <div className="flex flex-col gap-6 flex-1">
          {/* Client Details */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-semibold text-sm bg-[#181D27] text-white">
              {proposal.client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Client (Sender)
              </p>
              <p className="font-rozha text-base text-[#181D27]">{proposal.client.name}</p>
              <p className="font-work-sans text-xs text-gray-500">
                {proposal.client.email} {proposal.client.country ? `• ${proposal.client.country}` : ""}
              </p>
            </div>
          </div>

          {/* Description */}
          {proposal.serviceDescription && (
            <div>
              <h3 className="font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Project Scope / Description
              </h3>
              <p className="font-work-sans text-sm text-[#414651] bg-gray-50/50 rounded-xl p-4 border border-gray-100/50 whitespace-pre-wrap leading-relaxed">
                {proposal.serviceDescription}
              </p>
            </div>
          )}

          {/* Price & Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <span className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={12} /> Proposed Price
              </span>
              <p className="font-rozha text-xl text-[#16A34A] mt-1.5">
                {proposal.proposedPrice} {proposal.currency}
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <span className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Payment Method
              </span>
              <p className="font-work-sans text-sm font-semibold text-[#181D27] mt-2">
                {getPaymentLabel(proposal.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Timeline Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} /> Start / Issue Date
              </span>
              <p className="font-work-sans text-sm text-[#181D27] font-semibold mt-1">
                {formatDate(proposal.issueDate)}
              </p>
            </div>
            <div>
              <span className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={12} /> Due Date / Delivery
              </span>
              <p className="font-work-sans text-sm text-[#181D27] font-semibold mt-1">
                {formatDate(proposal.dueDate)}
              </p>
            </div>
          </div>

          {/* Client Notes */}
          {proposal.notes && (
            <div>
              <h3 className="font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Client Notes
              </h3>
              <p className="font-work-sans text-sm text-[#414651] bg-gray-50/50 rounded-xl p-3.5 border border-gray-100/50 italic">
                &ldquo;{proposal.notes}&rdquo;
              </p>
            </div>
          )}

          {/* Proposed Terms */}
          {proposal.terms && (
            <div>
              <h3 className="font-work-sans text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Proposed Terms
              </h3>
              <p className="font-work-sans text-sm text-[#414651] bg-gray-50/50 rounded-xl p-3.5 border border-gray-100/50">
                {proposal.terms}
              </p>
            </div>
          )}

          {/* Action Row inside modal */}
          {proposal.status === "PENDING" && (
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100 mt-auto">
              <button
                disabled={isActionPending}
                onClick={onDecline}
                className="w-36 h-12 rounded-full border border-red-200 text-red-600 font-work-sans text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Decline
              </button>
              <button
                disabled={isActionPending}
                onClick={onAccept}
                className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return createPortal(content, document.body);
}

export default function ReceivedProposalsPage() {
  const [activeCategory, setActiveCategory] = useState<"RECEIVED" | "SENT">("RECEIVED");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED" | "REJECTED">("ALL");
  const [selectedProposal, setSelectedProposal] = useState<ServiceProposal | null>(null);

  // Mutations & Queries
  const { data: proposals = [], isLoading, error } = useReceivedProposals();
  const acceptMutation = useAcceptProposal();
  const declineMutation = useDeclineProposal();

  const filteredProposals = proposals.filter((p) => {
    if (filter === "ALL") return true;
    return p.status === filter;
  });

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const getPaymentLabel = (method: string) => {
    switch (method) {
      case "TRUST_APP":
        return "Trust App";
      case "BANK_TRANSFER":
        return "Bank Transfer";
      case "CARD":
        return "Credit/Debit Card";
      default:
        return method;
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await acceptMutation.mutateAsync(id);
      toast.success("Proposal accepted successfully!");
      setSelectedProposal(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to accept proposal");
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await declineMutation.mutateAsync(id);
      toast.success("Proposal declined successfully!");
      setSelectedProposal(null);
    } catch (e: any) {
      toast.error(e?.message || "Failed to decline proposal");
    }
  };

  const isActionPending = acceptMutation.isPending || declineMutation.isPending;

  return (
    <div className="flex flex-col h-full px-4 py-8 lg:px-12 overflow-y-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
          <h1 className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] leading-tight">
            My Proposals
          </h1>
          <p className="font-work-sans text-sm text-[#535862] mt-1">
            Review and respond to service proposals sent or received
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-[#F5F5F5] rounded-full p-1 border border-gray-100 self-start md:self-center shrink-0">
          {(["ALL", "PENDING", "ACCEPTED", "REJECTED"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-2 rounded-full text-xs font-semibold font-work-sans transition-all uppercase ${
                filter === t
                  ? "bg-[#181D27] text-white shadow-xs"
                  : "text-[#535862] hover:text-[#181D27]"
              }`}
            >
              {t === "ALL" ? "All" : t.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs: Received vs Sent */}
      <div className="flex border-b border-gray-200/60 mb-6 shrink-0 gap-6">
        <button
          onClick={() => {
            setActiveCategory("RECEIVED");
            setFilter("ALL");
          }}
          className={`pb-3 font-work-sans font-semibold text-sm transition-all relative ${
            activeCategory === "RECEIVED" ? "text-[#181D27]" : "text-[#98A2B3] hover:text-[#535862]"
          }`}
        >
          Received Proposals
          {activeCategory === "RECEIVED" && (
            <motion.div
              layoutId="spActiveTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]"
            />
          )}
        </button>
        <button
          onClick={() => {
            setActiveCategory("SENT");
            setFilter("ALL");
          }}
          className={`pb-3 font-work-sans font-semibold text-sm transition-all relative ${
            activeCategory === "SENT" ? "text-[#181D27]" : "text-[#98A2B3] hover:text-[#535862]"
          }`}
        >
          Sent Proposals
          {activeCategory === "SENT" && (
            <motion.div
              layoutId="spActiveTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]"
            />
          )}
        </button>
      </div>

      {/* Main List */}
      <div className="flex-1 min-h-0">
        {activeCategory === "SENT" ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#F9F9F9] rounded-[24px] border border-gray-100 p-8 text-center">
            <Send className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="font-rozha text-xl text-[#181D27] mb-1.5">Direct Sent Proposals</h3>
            <p className="font-work-sans text-sm text-[#535862] max-w-sm leading-relaxed">
              In the direct transaction model, onboarding is initiated by clients. You will receive client proposals directly in the &ldquo;Received Proposals&rdquo; tab, which you can review and accept.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <svg className="animate-spin h-8 w-8 text-[#181D27] mb-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-work-sans text-sm text-[#535862]">Loading proposals...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 bg-red-50/50 rounded-3xl border border-red-100 p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-2" />
            <h3 className="font-rozha text-lg text-[#181D27] mb-1">Failed to load proposals</h3>
            <p className="font-work-sans text-sm text-red-600">{(error as any)?.message || "Network error. Please try again later."}</p>
          </div>
        ) : filteredProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-[#F9F9F9] rounded-[24px] border border-gray-100 p-8 text-center">
            <Send className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="font-rozha text-xl text-[#181D27] mb-1.5">No proposals found</h3>
            <p className="font-work-sans text-sm text-[#535862] max-w-sm">
              {filter === "ALL"
                ? "You haven't received any service proposals from clients yet."
                : `You don't have any received proposals with the status "${filter.toLowerCase()}".`}
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProposals.map((proposal) => (
              <motion.div
                key={proposal.id}
                variants={itemVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProposal(proposal)}
                className="bg-white hover:bg-[#FDFDFD] transition-all duration-300 border border-gray-200/80 hover:border-[#181D27]/10 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-[24px] p-6 cursor-pointer flex flex-col justify-between min-h-[260px] relative overflow-hidden"
              >
                <div>
                  {/* Header Meta */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      ID: #{proposal.id}
                    </span>
                    <StatusBadge status={proposal.status} />
                  </div>

                  {/* Title */}
                  <h3 className="font-rozha text-[19px] text-[#181D27] line-clamp-2 leading-snug mb-2">
                    {proposal.proposalTitle}
                  </h3>

                  {/* Scope Preview */}
                  <p className="font-work-sans text-xs text-[#535862] line-clamp-3 mb-4 leading-relaxed">
                    {proposal.serviceDescription || "No description provided."}
                  </p>

                  {/* Received details */}
                  <div className="flex items-center gap-3 text-gray-400 font-work-sans text-[11px] mb-4 shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" />
                      {formatDate(proposal.createdAt)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1 text-gray-500 font-medium">
                      via {getPaymentLabel(proposal.paymentMethod)}
                    </span>
                  </div>
                </div>

                {/* Footer and action row */}
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      {/* Client Info */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-semibold text-xs bg-[#181D27] text-white">
                          {proposal.client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-work-sans text-[10px] text-gray-400 uppercase tracking-wider">From Client</p>
                          <p className="font-rozha text-sm text-[#181D27] leading-tight truncate max-w-[100px]">
                            {proposal.client.name}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="font-work-sans text-[10px] text-gray-400 uppercase tracking-wider">Proposed Price</p>
                        <p className="font-work-sans text-[15px] font-bold text-[#16A34A] mt-0.5">
                          {proposal.proposedPrice} {proposal.currency}
                        </p>
                      </div>
                    </div>

                    {/* Quick Action buttons on card */}
                    {proposal.status === "PENDING" && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-50 mt-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          disabled={isActionPending}
                          onClick={() => handleDecline(proposal.id)}
                          className="flex-1 h-9 rounded-full border border-red-100 text-red-600 font-work-sans text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          Decline
                        </button>
                        <button
                          disabled={isActionPending}
                          onClick={() => handleAccept(proposal.id)}
                          className="flex-1 h-9 rounded-full bg-[#181D27] text-white font-work-sans text-xs font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40"
                        >
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Details Side-over Panel */}
      <AnimatePresence>
        {selectedProposal && (
          <ProposalDetailsModal
            proposal={selectedProposal}
            isActionPending={isActionPending}
            onClose={() => setSelectedProposal(null)}
            onAccept={() => handleAccept(selectedProposal.id)}
            onDecline={() => handleDecline(selectedProposal.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
