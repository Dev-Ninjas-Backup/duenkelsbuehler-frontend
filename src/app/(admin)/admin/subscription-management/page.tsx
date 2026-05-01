"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, X, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminPlans, useAdminCreatePlan, useAdminUpdatePlan, useAdminTotalSubscribers } from "@/hooks/subscription/use-subscription";
import { useAdminUsers } from "@/hooks/admin/use-admin";
import type { CreatePlanData, UpdatePlanData } from "@/services/subscription/subscription-service";
import { toast } from "sonner";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors";

const statusColor: Record<string, string> = {
  ACTIVE: "text-[#16A34A] bg-[#16A34A]/10",
  TRIALING: "text-blue-600 bg-blue-50",
  PENDING: "text-orange-500 bg-orange-50",
  PAST_DUE: "text-red-500 bg-red-50",
  CANCELED: "text-[#9CA3AF] bg-gray-100",
  INCOMPLETE: "text-yellow-600 bg-yellow-50",
  UNPAID: "text-red-500 bg-red-50",
  SUCCESS: "text-[#16A34A] bg-[#16A34A]/10",
  PAID: "text-[#16A34A] bg-[#16A34A]/10",
  FAILED: "text-red-500 bg-red-50",
  REFUNDED: "text-[#9CA3AF] bg-gray-100",
};

function PlanModal({ plan, onClose }: {
  plan?: { id: number; name: string; description: string; amount: number; currency: string; interval: string } | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(plan?.name ?? "");
  const [description, setDescription] = useState(plan?.description ?? "");
  const [amount, setAmount] = useState(plan?.amount?.toString() ?? "");
  const [currency, setCurrency] = useState(plan?.currency ?? "USD");
  const [interval, setInterval] = useState<"MONTH" | "YEAR">(plan?.interval === "YEAR" ? "YEAR" : "MONTH");

  const { mutate: createPlan, isPending: isCreating } = useAdminCreatePlan();
  const { mutate: updatePlan, isPending: isUpdating } = useAdminUpdatePlan();
  const isPending = isCreating || isUpdating;

  const handleSubmit = () => {
    if (!name || !amount) return;
    if (plan) {
      const data: UpdatePlanData = { name, description, amount: parseFloat(amount), currency, interval };
      updatePlan({ planId: plan.id, data }, {
        onSuccess: () => { toast.success("Plan updated successfully!"); onClose(); },
        onError: (err) => toast.error((err as Error).message || "Failed to update plan"),
      });
    } else {
      const data: CreatePlanData = { name, description, amount: parseFloat(amount), currency, interval };
      createPlan(data, {
        onSuccess: () => { toast.success("Plan created successfully!"); onClose(); },
        onError: (err) => toast.error((err as Error).message || "Failed to create plan"),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-8 w-full max-w-md flex flex-col gap-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-rozha text-2xl text-[#181D27]">{plan ? "Edit Plan" : "Add New Plan"}</h2>
          <button onClick={onClose} aria-label="Close modal" className="text-gray-400 hover:text-[#181D27]"><X size={20} /></button>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-medium text-[#181D27]">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="AristoAccess+" className={inputCls} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-medium text-[#181D27]">Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Plan description" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">Amount *</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="9.99" className={inputCls} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label="Select currency" className={inputCls}>
              {["USD", "EUR", "GBP"].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-sm font-medium text-[#181D27]">Billing Interval</label>
          <div className="grid grid-cols-2 gap-3">
            {(["MONTH", "YEAR"] as const).map((i) => (
              <button key={i} type="button" onClick={() => setInterval(i)}
                className={`py-2 rounded-xl border-2 font-work-sans text-sm font-medium transition-all ${interval === i ? "border-[#181D27] bg-[#181D27]/5" : "border-gray-200"}`}>
                {i === "MONTH" ? "Monthly" : "Yearly"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!name || !amount || isPending}
          className="w-full h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors">
          {isPending ? "Saving..." : plan ? "Save Changes" : "Create Plan"}
        </button>
      </motion.div>
    </div>
  );
}

const PAGE_SIZE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

export default function SubscriptionManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"plans" | "subscribers">("plans");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: plans = [], isLoading: plansLoading } = useAdminPlans();
  const { mutate: updatePlan } = useAdminUpdatePlan();
  const { data: subscribers = [], isLoading: subscribersLoading } = useAdminTotalSubscribers();
  const { data: users = [] } = useAdminUsers();

  const getUserById = (id: number) => users.find((u) => u.id === id);
  const getPlanById = (id: number) => plans.find((p) => p.id === id);

  const totalPages = Math.ceil(subscribers.length / PAGE_SIZE) || 1;
  const paginated = subscribers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleToggleActive = (plan: any) => {
    updatePlan(
      { planId: plan.id, data: { isActive: !plan.isActive } },
      {
        onSuccess: () => toast.success(`Plan ${plan.isActive ? "deactivated" : "activated"} successfully!`),
        onError: (err) => toast.error((err as Error).message || "Failed to update plan"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="font-rozha text-2xl md:text-3xl text-[#181D27]">
          Subscription Management
        </motion.h2>
        {activeTab === "plans" && (
          <motion.button initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            whileTap={{ scale: 0.97 }} onClick={() => { setEditingPlan(null); setModalOpen(true); }}
            className="px-4 md:px-6 py-2.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors">
            <Plus size={16} className="inline mr-1" /> Add Plan
          </motion.button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(["plans", "subscribers"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-3 font-work-sans text-sm font-medium transition-colors capitalize ${activeTab === tab ? "text-[#181D27]" : "text-[#9CA3AF] hover:text-[#414651]"}`}>
            {tab === "plans" ? "Plans" : "Subscribers"}
            {activeTab === tab && (
              <motion.div layoutId="sub-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#181D27]" />
            )}
          </button>
        ))}
      </div>

      {/* Plans Tab */}
      {activeTab === "plans" && (
        plansLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#F9F9F9] rounded-2xl p-6 flex flex-col gap-3 animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded-lg" />
                <div className="h-3 w-48 bg-gray-200 rounded-lg" />
                <div className="h-8 w-28 bg-gray-200 rounded-lg" />
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <span className="font-work-sans text-sm text-[#414651]">No plans yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#F9F9F9] rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-rozha text-xl text-[#181D27]">{plan.name}</p>
                    <p className="font-work-sans text-xs text-[#9CA3AF] mt-0.5">{plan.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.85 }} title={plan.isActive ? "Deactivate" : "Activate"}
                      onClick={() => handleToggleActive(plan)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
                      {plan.isActive ? <ToggleRight size={16} className="text-green-600" /> : <ToggleLeft size={16} className="text-gray-400" />}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.85 }}
                      onClick={() => { setEditingPlan(plan); setModalOpen(true); }}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] transition-colors shadow-sm">
                      <Pencil size={13} />
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <p className="font-rozha text-3xl text-[#181D27]">{plan.currency} {plan.amount}</p>
                  <p className="font-work-sans text-sm text-[#9CA3AF] mb-1">/{plan.interval === "MONTH" ? "mo" : "yr"}</p>
                </div>
                <span className={`w-fit px-3 py-1 rounded-full font-work-sans text-xs font-medium ${plan.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                  {plan.isActive ? "Active" : "Inactive"}
                </span>
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Subscribers Tab */}
      {activeTab === "subscribers" && (
        <div className="flex flex-col gap-4">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-[40px_2fr_1.5fr_1fr_1fr_100px] bg-[#181D27] text-white rounded-xl px-6 py-3.5">
            <span className="font-work-sans text-sm font-medium">Sl</span>
            <span className="font-work-sans text-sm font-medium">User</span>
            <span className="font-work-sans text-sm font-medium">Plan</span>
            <span className="font-work-sans text-sm font-medium">Subscribed On</span>
            <span className="font-work-sans text-sm font-medium">Period End</span>
            <span className="font-work-sans text-sm font-medium text-center">Status</span>
          </div>

          {subscribersLoading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="animate-pulse hidden lg:grid grid-cols-[40px_2fr_1.5fr_1fr_1fr_100px] bg-[#F9F9F9] rounded-2xl px-6 py-4 items-center">
                  <div className="h-3 w-4 bg-gray-200 rounded-full" />
                  <div className="flex flex-col gap-1.5"><div className="h-3 w-28 bg-gray-200 rounded-full" /><div className="h-2.5 w-36 bg-gray-200 rounded-full" /></div>
                  <div className="h-3 w-24 bg-gray-200 rounded-full" />
                  <div className="h-3 w-16 bg-gray-200 rounded-full" />
                  <div className="h-3 w-20 bg-gray-200 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="font-work-sans text-sm text-[#9CA3AF]">No subscribers yet</span>
              <span className="font-work-sans text-xs text-[#9CA3AF] text-center max-w-sm">
                Subscribers appear here after Stripe webhook is configured.
              </span>
            </div>
          ) : (
            <>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3">
                {paginated.map((sub, i) => (
                  <motion.div key={sub.id} variants={rowVariants}
                    className="bg-[#F9F9F9] rounded-2xl px-5 py-4 lg:px-6 flex flex-col lg:grid lg:grid-cols-[40px_2fr_1.5fr_1fr_1fr_100px] lg:items-center gap-3 lg:gap-0 border border-gray-100/80">

                    <span className="hidden lg:block font-work-sans text-sm text-[#414651]">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </span>

                    {/* Mobile header */}
                    <div className="flex items-center justify-between lg:hidden border-b border-gray-200 pb-3">
                      <span className="font-work-sans text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                        #{(currentPage - 1) * PAGE_SIZE + i + 1}
                      </span>
                      <span className={`font-work-sans text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[sub.status] ?? "text-[#414651] bg-gray-100"}`}>
                        {sub.status}
                      </span>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#181D27] flex items-center justify-center shrink-0">
                        <span className="font-work-sans text-xs font-bold text-white">
                          {getUserById(sub.userId)?.name?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-work-sans text-sm font-bold text-[#181D27] truncate">
                          {getUserById(sub.userId)?.name ?? `User #${sub.userId}`}
                        </span>
                        <span className="font-work-sans text-xs text-[#9CA3AF] truncate">
                          {getUserById(sub.userId)?.email ?? ""}
                        </span>
                      </div>
                    </div>

                    {/* Plan */}
                    <span className="font-work-sans text-sm text-[#414651]">
                      {getPlanById(sub.planId)?.name ?? `Plan #${sub.planId}`}
                    </span>

                    {/* Subscribed On */}
                    <span className="font-work-sans text-xs text-[#9CA3AF]">
                      {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                    </span>

                    {/* Period End */}
                    <span className="font-work-sans text-xs text-[#9CA3AF]">
                      {sub.currentPeriodEnd
                        ? new Date(sub.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })
                        : "—"}
                    </span>

                    {/* Status desktop */}
                    <div className="hidden lg:flex justify-center">
                      <span className={`font-work-sans text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[sub.status] ?? "text-[#414651] bg-gray-100"}`}>
                        {sub.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-2">
                  <span className="font-work-sans text-sm text-[#414651]">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, subscribers.length)} of {subscribers.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
                      <ChevronLeft className="h-4 w-4" />
                    </motion.button>
                    <span className="font-work-sans text-sm text-[#414651]">{currentPage} / {totalPages}</span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#414651] hover:bg-gray-50 disabled:opacity-40 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {modalOpen && (
        <PlanModal plan={editingPlan} onClose={() => { setModalOpen(false); setEditingPlan(null); }} />
      )}
    </div>
  );
}
