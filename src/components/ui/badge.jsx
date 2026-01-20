import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

/**
 * Semantic Color Design Tokens from src/styles/theme/tokens.css
 *
 * Status Color Tokens:
 * - --color-success: hsl(142, 76%, 36%) - Green for success states
 * - --color-success-foreground: hsl(0, 0%, 100%) - White text on success
 * - --color-warning: hsl(38, 92%, 50%) - Orange/amber for warnings
 * - --color-warning-foreground: hsl(0, 0%, 100%) - White text on warning
 * - --color-info: hsl(199, 89%, 48%) - Blue for informational messages
 * - --color-info-foreground: hsl(0, 0%, 100%) - White text on info
 * - --color-destructive: hsl(0, 84.2%, 60.2%) - Red for destructive/error states
 * - --color-destructive-foreground: hsl(210, 40%, 98%) - Light text on destructive
 * - --color-ring: hsl(222.2, 47.4%, 11.2%) - Focus ring color
 */

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground hover:bg-info/80",
        error: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
));
Badge.displayName = "Badge";

export { Badge, badgeVariants }
