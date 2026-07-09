"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { useTransactStore } from "@/stores/transact/use-transact-store";

const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";
const selectCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] focus:outline-none focus:border-[#181D27] bg-white transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23414651%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:10px_auto] bg-[position:right_16px_center] bg-no-repeat";
const textareaCls = "w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors resize-none";
const labelCls = "font-work-sans text-sm font-medium text-[#181D27]";

function formatDateToInput(dateVal: string): string {
  if (!dateVal) return "";
  const parts = dateVal.split("-"); // YYYY-MM-DD
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateVal;
}

function showDatePicker(id: string) {
  const el = document.getElementById(id) as HTMLInputElement;
  if (el) {
    try {
      el.showPicker();
    } catch (e) {
      el.focus();
    }
  }
}

export function ProposalDetailsStep() {
  const { data, updateData, setStep } = useTransactStore();

  const [title, setTitle] = useState(data.title);
  const [serviceDescription, setServiceDescription] = useState(data.serviceDescription);
  const [issueDate, setIssueDate] = useState(data.issueDate);
  const [dueDate, setDueDate] = useState(data.dueDate);
  const [price, setPrice] = useState(data.price);
  const [currency, setCurrency] = useState(data.currency || "USD");
  const [paymentMethod, setPaymentMethod] = useState(data.paymentMethod || "CARD");

  const minPrice = paymentMethod === "BANK_TRANSFER" ? 300 : 150;
  const isPriceValid = price === "" || Number(price) >= minPrice;
  const canNext = title && serviceDescription && issueDate && dueDate && price && Number(price) >= minPrice;

  const saveData = () => {
    updateData({
      title,
      serviceDescription,
      issueDate,
      dueDate,
      price,
      currency,
      paymentMethod,
    });
  };

  return (
    <motion.div
      key="proposal-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col max-w-lg mx-auto w-full pb-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-rozha text-4xl lg:text-5xl text-[#181D27] text-center mb-8"
      >
        Proposal Details
      </motion.h1>

      <div className="flex flex-col gap-5">
        {/* Proposal Title */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Proposal Title <span className="text-red-500">*</span></label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Start Typing here"
            className={inputCls}
          />
        </div>

        {/* Service Description */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Service Description <span className="text-red-500">*</span></label>
          <textarea
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
            placeholder="Describe the services you need in detail..."
            rows={4}
            maxLength={3000}
            className={textareaCls}
          />
        </div>

        {/* Issue Date & Due Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Issue Date */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Issue Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className={`${inputCls} pr-10`}
              />
              <input
                id="issue-date-picker"
                type="date"
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                onChange={(e) => {
                  const formatted = formatDateToInput(e.target.value);
                  if (formatted) setIssueDate(formatted);
                }}
              />
              <button
                type="button"
                onClick={() => showDatePicker("issue-date-picker")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#181D27] transition-colors"
                aria-label="Open issue date calendar"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Due Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="DD/MM/YYYY"
                className={`${inputCls} pr-10`}
              />
              <input
                id="due-date-picker"
                type="date"
                className="absolute opacity-0 pointer-events-none w-0 h-0"
                onChange={(e) => {
                  const formatted = formatDateToInput(e.target.value);
                  if (formatted) setDueDate(formatted);
                }}
              />
              <button
                type="button"
                onClick={() => showDatePicker("due-date-picker")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#181D27] transition-colors"
                aria-label="Open due date calendar"
              >
                <Calendar size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Price & Currency Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className={labelCls}>Price <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`Min ${minPrice}`}
              className={inputCls}
            />
            {!isPriceValid && (
              <span className="font-work-sans text-xs text-red-500">
                Minimum proposed price for {paymentMethod === "BANK_TRANSFER" ? "Bank/Wire Transfer is 300" : "Card payment is 150"}.
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={selectCls}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CHF">CHF</option>
            </select>
          </div>
        </div>

        {/* Preferred Payment Method */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Preferred Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className={selectCls}
          >
            <option value="CARD">Credit/Debit Card</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-center items-center gap-6 pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              saveData();
              setStep("select-services");
            }}
            className="w-36 h-12 rounded-full border border-gray-200 font-work-sans text-sm text-[#414651] font-medium hover:bg-gray-50 transition-colors"
          >
            ← Back
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              saveData();
              setStep("final-remarks");
            }}
            disabled={!canNext}
            className="w-36 h-12 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
