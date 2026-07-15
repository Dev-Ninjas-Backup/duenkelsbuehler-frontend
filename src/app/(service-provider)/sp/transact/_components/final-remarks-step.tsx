"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const inputCls = "w-full h-12 border border-gray-200 rounded-xl px-4 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] bg-white transition-colors";
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

interface Props {
  initialData: {
    issueDate: string;
    dueDate: string;
    notes: string;
    terms: string;
  };
  onNext: (data: {
    issueDate: string;
    dueDate: string;
    notes: string;
    terms: string;
  }) => void;
}

export function SPFinalRemarksStep({ initialData, onNext }: Props) {
  const [issueDate, setIssueDate] = useState(initialData.issueDate);
  const [dueDate, setDueDate] = useState(initialData.dueDate);
  const [notes, setNotes] = useState(initialData.notes);
  const [terms, setTerms] = useState(initialData.terms);

  const canNext = issueDate && dueDate;

  const handleSubmit = () => {
    if (!canNext) return;
    onNext({
      issueDate,
      dueDate,
      notes,
      terms,
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
        Final Remarks & Dates
      </motion.h2>

      <div className="flex flex-col gap-5">
        {/* Date Row */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5 relative">
            <label className={labelCls}>Issue Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                id="issue-date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full pointer-events-none"
              />
              <button
                type="button"
                onClick={() => showDatePicker("issue-date")}
                className="w-full h-12 border border-gray-200 rounded-xl px-4 flex items-center justify-between font-work-sans text-sm text-[#181D27] bg-white"
              >
                <span>{formatDateToInput(issueDate) || "DD/MM/YYYY"}</span>
                <Calendar size={18} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 relative">
            <label className={labelCls}>Due Date <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full pointer-events-none"
              />
              <button
                type="button"
                onClick={() => showDatePicker("due-date")}
                className="w-full h-12 border border-gray-200 rounded-xl px-4 flex items-center justify-between font-work-sans text-sm text-[#181D27] bg-white"
              >
                <span>{formatDateToInput(dueDate) || "DD/MM/YYYY"}</span>
                <Calendar size={18} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Please have all documents ready."
            rows={4}
            className={textareaCls}
          />
        </div>

        {/* Terms */}
        <div className="flex flex-col gap-1.5">
          <label className={labelCls}>Terms</label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="e.g. 50% upfront, 50% on delivery."
            rows={4}
            maxLength={300}
            className={textareaCls}
          />
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
