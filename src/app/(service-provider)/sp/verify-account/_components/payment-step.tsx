import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrownSVG, BrandLabel } from "./shared";

export function PaymentStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="max-w-lg mx-auto w-full flex flex-col items-center">
      <CrownSVG className="w-20 h-14" />
      <BrandLabel />

      <div className="w-full bg-[#F9F9F9] rounded-2xl p-6 flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="font-work-sans font-semibold text-[#181D27]">AristoAccess+</p>
          <p className="font-rozha text-xl text-[#181D27]">
            $9.99<span className="font-work-sans text-sm text-[#9CA3AF]">/mo</span>
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-xs font-medium text-[#414651]">Card Number</label>
          <div className="relative">
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
            />
            <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-xs font-medium text-[#414651]">Expiry Date</label>
            <input
              type="text"
              placeholder="MM / YY"
              maxLength={7}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-work-sans text-xs font-medium text-[#414651]">CVV</label>
            <input
              type="text"
              placeholder="•••"
              maxLength={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-work-sans text-xs font-medium text-[#414651]">Cardholder Name</label>
          <input
            type="text"
            placeholder="Full name on card"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
          />
        </div>

        <div className="flex items-center gap-2 text-[#9CA3AF]">
          <Lock size={13} />
          <p className="font-work-sans text-xs">Payments are secured and encrypted</p>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-14 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-base"
      >
        Pay $9.99
      </Button>
    </div>
  );
}
