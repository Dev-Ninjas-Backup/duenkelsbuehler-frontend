"use client";

import { useEffect, useState } from "react";
import { Loader2, ExternalLink, ShieldCheck } from "lucide-react";

interface TermlyPolicyProps {
  policyId: string;
  policyUrl?: string;
  title?: string;
}

export function TermlyPolicy({ policyId, policyUrl, title }: TermlyPolicyProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptId = "termly-embed-policy-script";

    // Remove any previously injected script to ensure fresh execution on route changes
    const oldScript = document.getElementById(scriptId);
    if (oldScript) {
      oldScript.remove();
    }

    setLoading(true);

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;

    script.onload = () => {
      // Allow slight delay for Termly's renderer to populate the container
      setTimeout(() => setLoading(false), 400);
    };

    script.onerror = () => {
      setLoading(false);
    };

    document.body.appendChild(script);

    // Fallback timer so loader never hangs indefinitely
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => {
      clearTimeout(fallbackTimer);
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [policyId]);

  return (
    <div className="w-full">
      {/* Top Header Card Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600 font-work-sans">
          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
          <span>Official legally binding document managed securely by Termly.</span>
        </div>
        {policyUrl && (
          <a
            href={policyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#181D27] hover:text-[#16A34A] transition-colors py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200"
          >
            <span>Open in Fullscreen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#16A34A]" />
          <p className="text-gray-500 font-work-sans text-sm animate-pulse">
            Loading {title || "policy"}...
          </p>
        </div>
      )}

      {/* Termly Embed container */}
      <div
        className={`w-full min-h-[700px] transition-opacity duration-300 ${
          loading ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
        }`}
      >
        <div
          {...({ name: "termly-embed" } as React.HTMLAttributes<HTMLDivElement>)}
          data-id={policyId}
        />
      </div>

      {/* Bottom Fallback / Help Notice */}
      {policyUrl && (
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3 font-work-sans">
          <span>
            Can&apos;t see the policy or using an ad-blocker? You can also view it directly on the hosted Termly viewer.
          </span>
          <a
            href={policyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[#16A34A] hover:underline shrink-0"
          >
            View on Termly
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
