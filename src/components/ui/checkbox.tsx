"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-4 shrink-0 rounded-md border border-white/60 bg-white/60 shadow-[0_6px_18px_rgba(7,17,52,0.08)] transition-all outline-none focus-visible:ring-4 focus-visible:ring-primary/25 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#2d7bff] data-[state=checked]:to-[#60e0ff] data-[state=checked]:border-transparent text-white",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
