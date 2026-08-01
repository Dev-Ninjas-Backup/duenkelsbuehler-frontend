import { motion } from "framer-motion";

interface InvoiceData {
  invoiceTitle: string;
  issueDate: string;
  dueDate: string;
  price: string;
  tax: string;
}

interface Props {
  data: InvoiceData;
  onChange: (field: keyof InvoiceData, value: string) => void;
  onNext: () => void;
}

const fields: { key: keyof InvoiceData; label: string; placeholder: string; type?: string }[] = [
  { key: "invoiceTitle", label: "Invoice Title",  placeholder: "Start Typing here" },
  { key: "issueDate",    label: "Issue Date",     placeholder: "DD/MM/YYYY", type: "text" },
  { key: "dueDate",      label: "Due Date:",      placeholder: "DD/MM/YYYY", type: "text" },
  { key: "price",        label: "Price",          placeholder: "Enter Price" },
  { key: "tax",          label: "Tax:",           placeholder: "Enter Tax" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function InvoiceStep({ data, onChange, onNext }: Props) {
  const canProceed = data.invoiceTitle && data.issueDate && data.dueDate && data.price && data.tax;

  return (
    <div className="max-w-lg mx-auto w-full flex flex-col gap-5">
      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="font-rozha text-2xl text-[#181D27] text-center"
      >
        Invoice Details
      </motion.h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        className="flex flex-col gap-4"
      >
        {fields.map(({ key, label, placeholder, type }) => (
          <motion.div key={key} variants={itemVariants} className="flex flex-col gap-1.5">
            <label className="font-work-sans text-sm font-medium text-[#181D27]">
              {label} <span className="text-red-500">*</span>
            </label>
            <input
              type={type ?? "text"}
              placeholder={placeholder}
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-work-sans text-sm text-[#181D27] placeholder:text-gray-400 focus:outline-none focus:border-[#181D27] transition-colors bg-white"
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="font-work-sans text-xs text-[#414651]"
      >
        Accounting and e-invoicing regulations vary by region, so be sure that this invoice adheres to your local law.
      </motion.p>

      <div className="flex justify-center mt-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!canProceed}
          onClick={onNext}
          className="px-8 py-3 rounded-full bg-[#181D27] text-white font-work-sans text-sm font-semibold hover:bg-[#181D27]/90 disabled:opacity-40 transition-colors"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
