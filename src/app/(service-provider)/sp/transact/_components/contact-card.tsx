import Image from "next/image";
import { motion } from "framer-motion";
import { Contact } from "./types";
import { BadgeIcon } from "./badge-icon";

interface Props {
  contact: Contact;
  onClick: (contact: Contact) => void;
}

export function ContactCard({ contact, onClick }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(contact)}
      className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col items-center gap-3 hover:bg-gray-100 transition-colors w-full cursor-pointer shadow-sm"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={contact.avatar}
            alt={contact.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>
        {contact.badge && <BadgeIcon type={contact.badge} />}
      </div>
      <span className="font-work-sans text-sm font-bold text-[#181D27] text-center leading-snug">
        {contact.name}
      </span>
    </motion.button>
  );
}
