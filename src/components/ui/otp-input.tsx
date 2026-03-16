"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  length?: number
  onChange?: (value: string) => void
  separator?: boolean
}

function OTPInput({
  length = 4,
  onChange,
  separator = false,
  className,
  ...props
}: OTPInputProps) {
  const [otp, setOtp] = React.useState<string[]>(Array(length).fill(""))
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    onChange?.(newOtp.join(""))
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, i) => {
      if (i < length) newOtp[i] = char
    })
    setOtp(newOtp)
    onChange?.(newOtp.join(""))
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus()
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "h-12 w-12 rounded-md border border-input bg-transparent text-center text-lg font-medium shadow-xs transition-[color,box-shadow] outline-none",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            )}
            {...props}
          />
          {separator && index === Math.floor(length / 2) - 1 && (
            <span className="text-muted-foreground">-</span>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export { OTPInput }
