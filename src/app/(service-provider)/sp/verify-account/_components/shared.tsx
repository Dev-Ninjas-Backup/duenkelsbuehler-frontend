import Image from "next/image";

export function CrownSVG({ className }: { className?: string }) {
  return (
    <Image src="/svg/black_crown.svg" alt="Crown" width={80} height={56} className={className} />
  );
}

export function BrandLabel() {
  return (
    <p className="font-work-sans font-bold text-lg text-[#181D27] mt-2 mb-6">
      AristoAccess<span className="text-[#181D27]">+</span>
    </p>
  );
}
