import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-24 w-full rounded-2xl border border-white/55 bg-white/85 px-4 py-3 text-base shadow-[0_18px_45px_rgba(7,17,52,0.08)] transition-all outline-none backdrop-blur disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
