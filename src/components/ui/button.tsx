import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-primary/30 aria-invalid:ring-destructive/30",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#2d7bff] via-[#3c96ff] to-[#63d8ff] text-white shadow-[0_20px_45px_rgba(16,63,173,0.35)] hover:shadow-[0_18px_40px_rgba(18,70,180,0.45)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "border border-slate-200 bg-white/90 text-foreground shadow-[0_12px_30px_rgba(7,17,52,0.08)] hover:border-primary/50 hover:text-primary",
        secondary:
          "bg-slate-900 text-white shadow-[0_20px_50px_rgba(3,6,23,0.55)] hover:bg-slate-800",
        ghost:
          "text-foreground hover:bg-white/70 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 has-[>svg]:px-5",
        sm: "h-9 gap-1.5 px-4 text-[13px]",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
