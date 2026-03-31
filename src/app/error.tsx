"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RotateCw, HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center text-center max-w-2xl gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative h-20 w-48 mb-6">
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
        
        <div className="bg-destructive/10 p-5 rounded-full mb-2 animate-bounce">
          <svg className="w-14 h-14 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="font-rozha text-4xl md:text-5xl font-bold text-foreground">
          Something Went Wrong
        </h2>
        
        <p className="text-muted-foreground md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
          We apologize for the inconvenience. An unexpected error has occurred while trying to process your request. Please try again later.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => reset()} 
            size="lg" 
            className="w-full sm:w-auto rounded-full shadow-lg h-14 px-8 text-base group"
          >
             <RotateCw className="w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
             Try Again
          </Button>
          <Button 
            variant="outline" 
            asChild
            size="lg" 
            className="w-full sm:w-auto rounded-full h-14 px-8 text-base group"
          >
             <Link href="/">
               <HomeIcon className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
               Go to Homepage
             </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
