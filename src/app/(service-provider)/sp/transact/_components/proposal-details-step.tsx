"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";
const selectCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] focus:outline-none focus:border-[#181D27] bg-white transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23414651%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:10px_auto] bg-[position:right_16px_center] bg-no-repeat";
const textareaCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors resize-none";
const labelCls = "font-work-sans text-sm font-medium text-[#181D27]";

interface Props {
  initialData: {
    title: string;
    serviceDescription: string;
    price: string;
    currency: string;
    paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  };
  onNext: (data: {
    title: string;
    serviceDescription: string;
    price: string;
    currency: string;
    paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  }) => void;
}

export function SPProposalDetailsStep({ initialData, onNext }: Props) {
  const [title, setTitle] = useState(initialData.title);
  const [serviceDescription, setServiceDescription] = useState(initialData.serviceDescription);
  const [price, setPrice] = useState(initialData.price);
  const [currency, setCurrency] = useState(initialData.currency || "USD");
  const [paymentMethod, setPaymentMethod] = useState<"TRUST_APP" | "BANK_TRANSFER" | "CARD">(initialData.paymentMethod || "CARD");

  const minPrice = paymentMethod === "BANK_TRANSFER" ? 300 : 150;
  const isPriceValid = price === "" || Number(price) >= minPrice;
  const canNext = title && serviceDescription && price && Number(price) >= minPrice;

  const handleSubmit = () => {
    if (!canNext) return;
    onNext({
      title,
      serviceDescription,
      price,
      currency,
      paymentMethod,
    });
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto w-full pb-8">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-rozha text-2xl text-[#181D27] text-center mb-6"
      >
        Proposal Details
      </motion.h2>

      <div className="flex flex-col gap-5">
        {/* Proposal Title */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Proposal Title <span className="text-red-500">*</span></label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Graphic Design Services"
            className={inputCls}
          />
        </div>

        {/* Service Description */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Service Description <span className="text-red-500">*</span></label>
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            placeholder="Describe what services you will provide..."
            rows={4}
            maxLength={3000}
            className={textareaCls}
          />
        </div>

        {/* Price & Currency */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className={labelCls}>Proposed Price <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className={`${inputCls} ${!isPriceValid ? "border-red-500 focus:border-red-500" : ""}`}
              />
            </div>
            {!isPriceValid && (
              <span className="font-work-sans text-xs text-red-500 mt-1">
                The minimum price for this payment method is {minPrice} {currency}.
              </span>
            )}
          </div>

          <div className="w-[120px] flex flex-col gap-1.5">
            <label className={labelCls}>Currency <span className="text-red-500">*</span></label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={selectCls}
            >
              {["EUR", "USD", "GBP", "CHF", "CAD", "AUD"].map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Preferred Payment Method <span className="text-red-500">*</span></label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className={selectCls}
          >
            <option value="CARD">Credit/Debit Card (Min. $150)</option>
            <option value="BANK_TRANSFER">Bank/Wire Transfer (Min. $300)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canNext}
          onClick={handleSubmit}
          className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors cursor-pointer w-full max-w-xs flex items-center justify-center"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
