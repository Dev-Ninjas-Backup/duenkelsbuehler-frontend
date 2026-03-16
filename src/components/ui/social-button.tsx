"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface SocialButtonProps extends React.ComponentProps<typeof Button> {
  provider: "google" | "facebook" | "apple" | "x" | "figma" | "dribbble"
  variant?: "default" | "outline"
}

const providerConfig = {
  google: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    ),
    label: "Sign in with Google",
  },
  facebook: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    label: "Sign in with Facebook",
  },
  apple: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
    label: "Sign in with Apple",
  },
  x: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    label: "Sign in with X",
  },
  figma: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
        <path fill="#F24E1E" d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4z" />
        <path fill="#FF7262" d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4z" />
        <path fill="#A259FF" d="M4 4c0-2.208 1.792-4 4-4h4v8H8C5.792 8 4 6.208 4 4z" />
        <path fill="#1ABCFE" d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0z" />
        <path fill="#0ACF83" d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4z" />
      </svg>
    ),
    label: "Sign in with Figma",
  },
  dribbble: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#EA4C89">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm8.19 4.54c1.48 1.81 2.38 4.11 2.43 6.61-.32-.07-3.54-.72-6.79-.31-.07-.17-.14-.34-.22-.51-.2-.48-.42-.96-.65-1.43 3.56-1.45 5.18-3.57 5.23-3.36zM12 2.03c2.7 0 5.17 1.04 7.03 2.73-.04.18-1.46 2.19-4.89 3.48C12.68 5.58 11.03 3.4 10.8 3.1c.39-.05.79-.07 1.2-.07zM8.55 3.82c.22.28 1.84 2.46 3.32 5.1-4.18 1.11-7.87 1.09-8.27 1.09.56-2.74 2.18-5.04 4.95-6.19zM2 12v-.28c.4.01 4.86.06 9.35-1.3.28.55.54 1.11.78 1.68-.12.03-.24.07-.36.11-4.66 1.5-7.14 5.62-7.18 5.97A9.96 9.96 0 012 12zm10 10c-2.42 0-4.65-.87-6.38-2.31.03-.34 1.88-3.78 6.98-5.55.02-.01.04-.01.06-.02 1.33 3.45 1.87 6.35 2.01 7.16A9.94 9.94 0 0112 22zm4.74-1.55c-.1-.6-.6-3.4-1.84-6.81 3.04-.48 5.7.31 6.02.41-.43 2.59-1.88 4.84-4.18 6.4z" />
      </svg>
    ),
    label: "Sign in with Dribbble",
  },
}

function SocialButton({
  provider,
  variant = "outline",
  className,
  children,
  ...props
}: SocialButtonProps) {
  const config = providerConfig[provider]

  return (
    <Button variant={variant} className={cn("w-full gap-2", className)} {...props}>
      {config.icon}
      {children || config.label}
    </Button>
  )
}

export { SocialButton }
