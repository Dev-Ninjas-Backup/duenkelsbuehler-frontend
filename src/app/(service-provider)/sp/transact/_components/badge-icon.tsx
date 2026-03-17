import Image from "next/image";

export function BadgeIcon({ type }: { type: "gold" | "warning" }) {
  if (type === "gold") {
    return (
      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white border-2 border-white flex items-center justify-center">
        <Image src="/svg/crown.svg" alt="Verified" width={14} height={14} className="object-contain" />
      </span>
    );
  }
  return (
    <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-red-400 border-2 border-white flex items-center justify-center">
      <svg viewBox="0 0 12 12" className="w-3 h-3 fill-white">
        <path d="M6 1L1 10h10L6 1zm0 2.5l3.2 5.5H2.8L6 3.5zM5.5 6h1v2h-1V6zm0 2.5h1v1h-1v-1z" />
      </svg>
    </span>
  );
}
