import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6">
      <div className="absolute top-8 left-8 sm:top-12 sm:left-12">
        <Link href="/">
          <div className="relative h-12 w-32 md:h-16 md:w-40 transition-transform hover:scale-105 duration-300">
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
        </Link>
      </div>
      
      <div className="flex flex-col items-center text-center max-w-2xl gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="relative">
          <h1 className="font-rozha text-[120px] md:text-[200px] font-bold text-primary drop-shadow-sm/5 leading-none select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl -z-10 rounded-full" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-md mx-auto leading-relaxed">
            We couldn't locate the page you're looking for. It might have been removed,
            renamed, or disabled at the moment.
          </p>
        </div>
        
        <Button asChild size="lg" className="rounded-full shadow-lg h-14 px-10 text-base mt-4 hover:scale-105 transition-transform duration-300">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}
