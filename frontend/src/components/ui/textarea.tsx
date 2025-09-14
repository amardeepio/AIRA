
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea(
  { className, ...props }: React.ComponentProps<"textarea">,
  ref: React.ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs ring-offset-background transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
}

export default React.forwardRef(Textarea)
