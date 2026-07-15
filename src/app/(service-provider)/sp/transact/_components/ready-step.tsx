"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AiFillWarning } from "react-icons/ai";
import { Client } from "./types";

interface Props {
  client: Client;
  title: string;
  serviceDescription: string;
  price: string;
  currency: string;
  paymentMethod: "TRUST_APP" | "BANK_TRANSFER" | "CARD";
  confirmClient: boolean;
  confirmUnverified: boolean;
  onConfirmClientChange: (val: boolean) => void;
  onConfirmUnverifiedChange: (val: boolean) => void;
  onSubmit: () => void;
  isPending?: boolean;
  error?: string | null;
}

export function ReadyStep({
  client,
  title,
  price,
  currency,
  paymentMethod,
  confirmClient,
  confirmUnverified,
  onConfirmClientChange,
  onConfirmUnverifiedChange,
  onSubmit,
  isPending,
  error,
}: Props) {
  const priceNum = Number(price) || 0;
  const currencySymbol = currency || "USD";

  // Calculations
  const clientPercentageFee = priceNum * 0.05;
  const clientFlatFee = 0.40;
  const clientFeeTotal = clientPercentageFee + clientFlatFee;
  const totalClientPays = priceNum + clientFeeTotal;

  const spStandardFee = priceNum * 0.05;
  const spPromoFee = priceNum * 0.03;
  const totalSpReceivesStandard = priceNum - spStandardFee;
  const totalSpReceivesPromo = priceNum - spPromoFee;

  const showUnverifiedCheckbox = !client.verified;
  const canSubmit = confirmClient && (showUnverifiedCheckbox ? confirmUnverified : true);

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

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col gap-6">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-rozha text-2xl text-[#181D27] text-center"
      >
        Review & Send Proposal
      </motion.h2>

      {/* Warning message if client is unverified */}
      {showUnverifiedCheckbox && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-2xl"
        >
          <AiFillWarning className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <p className="font-work-sans text-xs text-amber-700 leading-relaxed">
            <strong>Warning:</strong> This Client is not verified. Entering transactions with unverified users carries potential risks. We recommend ensuring they verify their account.
          </p>
        </motion.div>
      )}

      {/* Target Client Details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-[#F9F9F9] border border-gray-100 rounded-2xl p-5"
      >
        <p className="font-work-sans text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Sending To
        </p>
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            <Image
              src={client.avatar}
              alt={client.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-work-sans text-sm font-bold text-[#181D27]">
                {client.name}
              </span>
              {client.verified && (
                <Image
                  src="/svg/verified.svg"
                  alt="Verified"
                  width={14}
                  height={14}
                />
              )}
            </div>
            <span className="font-work-sans text-xs text-[#535862]">
              {client.email}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Proposal Summary & Fee Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white border border-gray-200/80 rounded-[24px] p-6 shadow-sm flex flex-col gap-4"
      >
        <div>
          <h3 className="font-rozha text-lg text-[#181D27] mb-1">{title || "Untitled Proposal"}</h3>
          <p className="font-work-sans text-xs text-gray-400">
            Payment Method: <span className="font-semibold text-gray-600">{getPaymentLabel(paymentMethod)}</span>
          </p>
        </div>

        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm font-work-sans">
            <span className="text-gray-500">Proposed Price</span>
            <span className="font-semibold text-[#181D27]">
              {priceNum.toLocaleString()} {currencySymbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-work-sans">
            <span className="text-gray-500">Client Protection Fee (5% + $0.40)</span>
            <span className="text-gray-600">
              +{clientFeeTotal.toFixed(2)} {currencySymbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm font-work-sans font-bold border-b border-gray-100 pb-3">
            <span className="text-[#181D27]">Total Client Pays</span>
            <span className="text-[#181D27]">
              {totalClientPays.toFixed(2)} {currencySymbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-work-sans text-gray-500">
            <span>You Receive (Standard 5% Fee)</span>
            <span className="font-semibold text-gray-700">
              {totalSpReceivesStandard.toFixed(2)} {currencySymbol}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-work-sans text-[#16A34A] bg-[#16A34A]/5 px-3 py-1.5 rounded-lg border border-[#16A34A]/10">
            <span>You Receive (Launch Promo 3% Fee)</span>
            <span className="font-bold">
              {totalSpReceivesPromo.toFixed(2)} {currencySymbol}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Checkboxes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmClient}
            onChange={(e) => onConfirmClientChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#181D27] cursor-pointer"
          />
          <span className="font-work-sans text-xs lg:text-sm text-[#414651] leading-tight">
            Click this box to confirm you are requesting the correct Client.
          </span>
        </label>

        {showUnverifiedCheckbox && (
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmUnverified}
              onChange={(e) => onConfirmUnverifiedChange(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#181D27] cursor-pointer"
            />
            <span className="font-work-sans text-xs lg:text-sm text-[#414651] leading-tight">
              By clicking here you acknowledge that you are making a transaction with an unverified user.
            </span>
          </label>
        )}
      </motion.div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="font-work-sans text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-center mt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canSubmit || isPending}
          onClick={onSubmit}
          className="px-8 py-3.5 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors cursor-pointer w-full max-w-xs flex items-center justify-center"
        >
          {isPending ? "Sending proposal..." : "Send Proposal"}
        </motion.button>
      </div>
    </div>
  );
}
