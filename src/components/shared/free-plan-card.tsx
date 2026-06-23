import { Check } from "lucide-react";

const FREE_FEATURES = [
  "Escrow-style payment protection",
  "Send and receive proposals",
  "Credit card & ACH payments",
  "USD · EUR · GBP · CHF",
  "5% seller · 3% buyer transaction fee",
  "$150 minimum transaction",
];

export function FreePlanCard({ onStart, compact }: { onStart?: () => void; compact?: boolean }) {
  const paddingCls = compact ? "p-4 lg:p-5 gap-3" : "p-6 gap-4";
  const listGapCls = compact ? "gap-1.5" : "gap-2";
  const textCls = compact ? "text-[13px] text-[#535862] leading-tight" : "text-sm text-[#535862]";

  return (
    <div className={`w-full border border-gray-200 rounded-2xl flex flex-col justify-between bg-white h-full flex-1 ${paddingCls}`}>
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-work-sans text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">FREE</p>
          <div className="flex items-start gap-0.5">
            <span className="font-work-sans text-base font-semibold text-[#181D27] mt-0.5">$</span>
            <span className="font-rozha text-4xl text-[#181D27] leading-none">0</span>
          </div>
          <p className="font-work-sans text-xs text-[#9CA3AF] mt-0.5">No monthly commitment</p>
        </div>

        <div className="h-px bg-gray-100" />

        <ul className={`flex flex-col ${listGapCls}`}>
          {FREE_FEATURES.map((f) => (
            <li key={f} className={`flex items-start gap-2 font-work-sans ${textCls}`}>
              <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {onStart && (
        <button
          onClick={onStart}
          className="w-full h-11 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-sm text-white transition-colors mt-1"
        >
          START FREE
        </button>
      )}
    </div>
  );
}
