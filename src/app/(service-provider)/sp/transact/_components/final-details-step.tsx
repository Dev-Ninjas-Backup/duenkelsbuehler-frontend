import { motion } from "framer-motion";

interface Props {
  notes: string;
  terms: string;
  onNotesChange: (val: string) => void;
  onTermsChange: (val: string) => void;
  onNext: () => void;
}

export function FinalDetailsStep({ notes, terms, onNotesChange, onTermsChange, onNext }: Props) {
  return (
    <div className="max-w-lg mx-auto w-full flex flex-col gap-5">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-rozha text-2xl text-[#181D27] text-center"
      >
        Final Details
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex flex-col gap-1.5"
      >
        <label className="font-work-sans text-sm font-medium text-[#181D27]">
          Notes: <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          placeholder={`Ex:  "Thanks".`}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors resize-none bg-white"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col gap-1.5"
      >
        <label className="font-work-sans text-sm font-medium text-[#181D27]">Terms:</label>
        <textarea
          rows={5}
          maxLength={300}
          placeholder={`Ex: "Payment due in 30 days".  (300 character limit)`}
          value={terms}
          onChange={(e) => onTermsChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors resize-none bg-white"
        />
      </motion.div>

      <div className="flex justify-center mt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 transition-colors"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
