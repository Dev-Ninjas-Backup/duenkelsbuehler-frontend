import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500">
        <div className="relative h-24 w-56 animate-pulse">
          <Image
            src="/images/logo/logo.png"
            alt="AristoPay"
            fill
            className="block object-contain dark:hidden"
            priority
          />
          <Image
            src="/images/logo/inverse_logo.png"
            alt="AristoPay"
            fill
            className="hidden object-contain dark:block"
            priority
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
          <div className="h-3 w-3 animate-bounce rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
}
