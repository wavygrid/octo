import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-black text-white border border-black",
  outline: "bg-white text-black border border-black",
  ghost: "bg-transparent text-black border border-gray-300",
}

const badgeSizes = {
  default: "px-2.5 py-0.5 text-xs",
  sm: "px-2 py-0.5 text-xs",
  xs: "px-1.5 py-0.5 text-xs",
}

const Badge = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge, badgeVariants, badgeSizes }