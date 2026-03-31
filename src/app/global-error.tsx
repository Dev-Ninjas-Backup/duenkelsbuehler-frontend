"use client";

import { useEffect } from "react";
import "./globals.css"; 

export default function GlobalError({
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
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-zinc-50 text-zinc-950 p-6 font-sans dark:bg-zinc-950 dark:text-zinc-50">
          <div className="flex flex-col items-center text-center max-w-2xl gap-6 animate-in fade-in duration-500">
            <div className="bg-red-500/10 p-5 rounded-full mb-2 animate-bounce">
              <svg className="w-14 h-14 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              A Fatal Error Occurred
            </h2>
            
            <p className="text-zinc-500 md:text-lg mb-8 max-w-lg mx-auto leading-relaxed dark:text-zinc-400">
              We highly apologize for the inconvenience. An unexpected system-level error has occurred and disrupted your session.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
              <button 
                onClick={() => reset()} 
                className="flex items-center justify-center w-full sm:w-auto rounded-full bg-blue-600 text-white shadow-lg h-14 px-8 text-base font-medium hover:bg-blue-700 transition-colors group cursor-pointer"
              >
                 <svg className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                 </svg>
                 Try Again
              </button>
              
              <a 
                href="/"
                className="flex items-center justify-center w-full sm:w-auto rounded-full border border-zinc-300 dark:border-zinc-800 bg-transparent h-14 px-8 text-base font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                 <svg className="w-5 h-5 mr-3 text-zinc-500 dark:text-zinc-400 group-hover:text-current transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                 </svg>
                 Go to Homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
