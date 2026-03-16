"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"

interface PhoneInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  countryCode?: string
  onCountryCodeChange?: (code: string) => void
}

function PhoneInput({
  className,
  countryCode = "+880",
  onCountryCodeChange,
  ...props
}: PhoneInputProps) {
  return (
    <div className="flex gap-2">
      <div className="relative flex items-center">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange?.(e.target.value)}
          aria-label="Country code"
          className={cn(
            "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <option value="+880">+880</option>
          <option value="+1">+1</option>
          <option value="+44">+44</option>
          <option value="+91">+91</option>
        </select>
      </div>
      <Input
        type="tel"
        className={cn("flex-1", className)}
        placeholder="Enter your phone number"
        {...props}
      />
    </div>
  )
}

export { PhoneInput }
