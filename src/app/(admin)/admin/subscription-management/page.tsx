"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, X } from "lucide-react";
import { useAdminPlans, useAdminCreatePlan, useAdminUpdatePlan } from "@/hooks/subscription/use-subscription";
import type { CreatePlanData, UpdatePlanData } from "@/services/subscription/subscription-service";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors";

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
      updatePlan({ planId: plan.id, data }, { onSuccess: onClose });
    } else {
      const data: CreatePlanData = { name, description, amount: parseFloat(amount), currency, interval };
      createPlan(data, { onSuccess: onClose });
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
          <button onClick={onClose} className="text-gray-400 hover:text-[#181D27]"><X size={20} /></button>
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
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className={inputCls}>
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

export default function SubscriptionManagementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const { data: plans = [], isLoading } = useAdminPlans();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <motion.h2 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="font-rozha text-2xl md:text-3xl text-[#181D27]">
          Subscription Plans
        </motion.h2>
        <motion.button initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          whileTap={{ scale: 0.97 }} onClick={() => { setEditingPlan(null); setModalOpen(true); }}
          className="px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors">
          <Plus size={16} className="inline mr-1" /> Add Plan
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-work-sans text-sm text-[#414651]">Loading...</span>
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
                <motion.button whileTap={{ scale: 0.85 }}
                  onClick={() => { setEditingPlan(plan); setModalOpen(true); }}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 bg-white border border-gray-200 rounded-full hover:text-[#181D27] transition-colors shadow-sm">
                  <Pencil size={13} />
                </motion.button>
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
      )}

      {modalOpen && (
        <PlanModal plan={editingPlan} onClose={() => { setModalOpen(false); setEditingPlan(null); }} />
      )}
    </div>
  );
}
