"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, MapPin, Briefcase, FileText } from "lucide-react";
import { useTransactStore } from "@/stores/transact/use-transact-store";
import { useProviderServiceItems } from "@/hooks/sp/use-sp";

export function SelectServicesStep() {
  const { data, updateData, setStep } = useTransactStore();
  const sp = data.sp!;

  // Fetch the selected provider's service items
  const { data: responseData, isLoading, error } = useProviderServiceItems(sp.id);
  const serviceItems = responseData?.serviceItems || [];

  // Local selection state initialized from store
  const [selectedIds, setSelectedIds] = useState<number[]>(data.selectedServiceItemIds || []);

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    updateData({ selectedServiceItemIds: selectedIds });
    setStep("proposal-details");
  };

  return (
    <motion.div
      key="select-services"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col max-w-lg mx-auto w-full pb-8"
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-[36px] lg:text-[40px] text-[#181D27] text-center mt-3 mb-2 shrink-0"
      >
        Select Services
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-work-sans text-[13px] lg:text-sm text-[#414651] text-center mb-6 shrink-0"
      >
        Choose one or more services offered by {sp.name}
      </motion.p>

      {/* S.P Header Card */}
      <div className="w-full bg-[#F9F9F9] border border-gray-100 rounded-2xl px-5 py-4 flex items-center gap-4 mb-6 shadow-xs">
        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 relative bg-gray-200">
          <Image src={sp.avatar} alt={sp.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-rozha text-lg text-[#181D27] truncate">{sp.name}</span>
            {sp.verified ? (
              <span className="flex items-center gap-0.5 font-work-sans text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                <ShieldCheck size={10} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-0.5 font-work-sans text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">
                <AlertTriangle size={10} /> Unverified
              </span>
            )}
          </div>
          <p className="font-work-sans text-xs text-[#535862] mt-0.5">{sp.handle}</p>
        </div>
      </div>

      {/* Service List container */}
      <div className="flex-1 flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-7 w-7 text-[#181D27] mb-2" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="font-work-sans text-xs text-gray-500">Loading service items...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-red-50/20 border border-red-100 rounded-2xl p-6">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <h4 className="font-rozha text-sm text-[#181D27] mb-1">Failed to load services</h4>
            <p className="font-work-sans text-xs text-red-600">{(error as any)?.message || "Something went wrong"}</p>
          </div>
        ) : serviceItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <FileText className="w-8 h-8 text-gray-300 mb-2" />
            <h4 className="font-rozha text-sm text-[#181D27] mb-1">No services listed</h4>
            <p className="font-work-sans text-xs text-gray-500">This provider has not listed any custom service items yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {serviceItems.map((item: any) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleSelect(item.id)}
                  className={`border rounded-2xl p-4.5 cursor-pointer transition-all duration-200 flex items-start gap-3.5 ${
                    isSelected
                      ? "border-[#181D27] bg-[#181D27]/[0.02] shadow-xs"
                      : "border-gray-200/80 bg-white hover:bg-gray-50/50"
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? "border-[#181D27] bg-[#181D27]" : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-white stroke-[3]">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Service Text Details */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-work-sans text-[13.5px] font-bold text-[#181D27] leading-snug">
                      {item.description}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 text-[10px] text-gray-400 font-work-sans font-medium">
                      {item.industry && (
                        <span className="flex items-center gap-1">
                          <Briefcase size={10} className="text-gray-300" />
                          {item.industry}
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-gray-300" />
                          {item.location}
                        </span>
                      )}
                      {item.workflowStatus && (
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider ${
                          item.workflowStatus === "OPEN_FOR_BIDS" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}>
                          {item.workflowStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center items-center gap-6 pt-6 shrink-0 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            updateData({ selectedServiceItemIds: selectedIds });
            setStep("search");
          }}
          className="w-36 h-12 rounded-full border border-gray-200 font-work-sans text-sm text-[#414651] font-medium hover:bg-gray-50 transition-colors cursor-pointer bg-white"
        >
          ← Back
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={selectedIds.length === 0}
          className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
}
