"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import "lenis/dist/lenis.css";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

function LenisAnchorHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"], a[href*="/#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const hash = href.slice(hashIndex);
      const id = hash.slice(1);
      
      const currentPath = window.location.pathname;
      const linkPath = link.pathname;

      if (currentPath === linkPath || linkPath === "") {
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, {
            duration: 1.5,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => document.removeEventListener("click", handleAnchorClick, { capture: true });
  }, [lenis]);

  return null;
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
      <LenisAnchorHandler />
      {children}
    </ReactLenis>
  );
}
