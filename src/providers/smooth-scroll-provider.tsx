"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import "lenis/dist/lenis.css";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.5,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
