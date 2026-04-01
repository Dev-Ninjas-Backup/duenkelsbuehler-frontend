import Image from "next/image";
import { AiFillWarning } from "react-icons/ai";

export function BadgeIcon({ type }: { type: "gold" | "warning" }) {
  if (type === "gold") {
    return (
      <span className="absolute -bottom-1 -right-1 flex items-center justify-center drop-shadow-sm">
        <Image src="/svg/crown.svg" alt="Verified" width={26} height={26} className="object-contain" />
      </span>
    );
  }
  return (
    <span className="absolute -bottom-1 -right-1 flex items-center justify-center drop-shadow-sm text-red-500">
      <AiFillWarning size={26} />
    </span>
  );
}
