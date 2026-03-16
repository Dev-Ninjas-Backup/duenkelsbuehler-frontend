import * as React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  variant?:
    | "display-2xl"
    | "display-xl"
    | "display-lg"
    | "display-md"
    | "display-sm"
    | "display-xs"
    | "text-xl"
    | "text-lg"
    | "text-md"
    | "text-sm"
    | "text-xs"
  weight?: "regular" | "medium" | "semibold" | "bold"
}

const variantStyles = {
  "display-2xl": "text-[72px] leading-[90px] tracking-[-0.02em]",
  "display-xl": "text-[60px] leading-[72px] tracking-[-0.02em]",
  "display-lg": "text-[48px] leading-[60px] tracking-[-0.02em]",
  "display-md": "text-[36px] leading-[44px] tracking-[-0.02em]",
  "display-sm": "text-[30px] leading-[38px]",
  "display-xs": "text-[24px] leading-[32px]",
  "text-xl": "text-[20px] leading-[30px]",
  "text-lg": "text-[18px] leading-[28px]",
  "text-md": "text-[16px] leading-[24px]",
  "text-sm": "text-[14px] leading-[20px]",
  "text-xs": "text-[12px] leading-[18px]",
}

const weightStyles = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

function Typography({
  as: Component = "p",
  variant = "text-md",
  weight = "regular",
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component
      className={cn(variantStyles[variant], weightStyles[weight], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

// Preset components for common use cases
function H1({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="h1" variant="display-2xl" weight="bold" className={className} {...props} />
}

function H2({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="h2" variant="display-xl" weight="semibold" className={className} {...props} />
}

function H3({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="h3" variant="display-lg" weight="semibold" className={className} {...props} />
}

function H4({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="h4" variant="display-md" weight="semibold" className={className} {...props} />
}

function H5({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="h5" variant="display-sm" weight="medium" className={className} {...props} />
}

function H6({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="h6" variant="display-xs" weight="medium" className={className} {...props} />
}

function P({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="p" variant="text-md" weight="regular" className={className} {...props} />
}

function Small({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="span" variant="text-sm" weight="regular" className={className} {...props} />
}

function Muted({ className, ...props }: Omit<TypographyProps, "as" | "variant">) {
  return <Typography as="p" variant="text-sm" weight="regular" className={cn("text-muted-foreground", className)} {...props} />
}

export { Typography, H1, H2, H3, H4, H5, H6, P, Small, Muted }
