import { Check } from "lucide-react";

const FREE_FEATURES = [
  "Escrow-style payment protection",
  "Send and receive proposals",
  "Credit card & ACH payments",
  "USD · EUR · GBP · CHF",
  "5% seller · 3% buyer transaction fee",
  "$150 minimum transaction",
];

export function FreePlanCard({ onStart }: { onStart?: () => void }) {
  return (
    <div className="w-full border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 bg-white">
      <div>
        <p className="font-work-sans text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-1">FREE</p>
        <div className="flex items-start gap-0.5">
          <span className="font-work-sans text-lg font-semibold text-[#181D27] mt-1">$</span>
          <span className="font-rozha text-5xl text-[#181D27] leading-none">0</span>
        </div>
        <p className="font-work-sans text-sm text-[#9CA3AF] mt-1">No monthly commitment</p>
      </div>

      <div className="h-px bg-gray-100" />

      <ul className="flex flex-col gap-2">
        {FREE_FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-2 font-work-sans text-sm text-[#535862]">
            <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
      </ul>

      {onStart && (
        <button
          onClick={onStart}
          className="w-full h-12 rounded-full bg-[#181D27] hover:bg-[#181D27]/90 font-work-sans font-semibold text-sm text-white transition-colors mt-2"
        >
          START FREE
        </button>
      )}
    </div>
  );
}
