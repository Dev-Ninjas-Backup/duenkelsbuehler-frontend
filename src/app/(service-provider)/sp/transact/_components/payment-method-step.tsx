import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Contact } from "./types";

const METHODS = [
  { id: "credit-card",  label: "Credit Card" },
  { id: "ach",          label: "ACH Payment" },
  { id: "escrow",       label: "Escrow" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

interface Props {
  contact: Contact;
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export function PaymentMethodStep({ contact, selected, onSelect, onNext }: Props) {
  return (
    <div className="max-w-lg mx-auto w-full flex flex-col gap-5">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-rozha text-2xl text-[#181D27]"
      >
        Big Ballin&apos; Much?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="font-work-sans text-sm text-[#414651] -mt-2"
      >
        Based on that selection you can choose the following payment methods:
      </motion.p>

      {/* Contact card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="bg-[#F5F5F5] rounded-2xl px-5 py-4 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
          <Image src={contact.avatar} alt={contact.name} width={48} height={48} className="object-cover w-full h-full" />
        </div>
        <div>
          <p className="font-work-sans text-sm font-bold text-[#181D27]">{contact.name}</p>
          {contact.badge === "gold" ? (
            <span className="flex items-center gap-1 font-work-sans text-xs text-[#16A34A] mt-0.5"><Image src="/svg/crown.svg" alt="Verified" width={13} height={13} /> Verified</span>
          ) : (
            <span className="flex items-center gap-1 font-work-sans text-xs text-red-500 mt-0.5"><ShieldAlert size={13} /> Unverified</span>
          )}
        </div>
      </motion.div>

      {/* Payment method options */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="flex flex-col gap-3"
      >
        {METHODS.map((method) => (
          <motion.button
            key={method.id}
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(method.id)}
            className="bg-[#F5F5F5] rounded-2xl px-5 py-4 flex items-center gap-4 hover:bg-gray-100 transition-colors w-full text-left"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected === method.id ? "border-[#16A34A]" : "border-gray-300"}`}>
              {selected === method.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              )}
            </div>
            <span className="font-work-sans text-sm font-medium text-[#181D27]">{method.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <div className="flex justify-end mt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!selected}
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
