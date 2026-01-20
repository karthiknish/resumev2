import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Design Tokens Reference (from src/styles/theme/tokens.css)
 *
 * Focus Ring Tokens:
 * - --color-ring: Primary color for focus rings (default: --color-primary)
 * - --shadow-ring-focus: Consistent focus ring shadow (0 0 0 2px hsl(var(--color-ring)))
 *
 * Border & Input Tokens:
 * - --color-input: Input border color (default: hsl(214.3 31.8% 91.4%))
 * - --color-background: Input background color
 * - --color-foreground: Input text color
 * - --color-muted-foreground: Placeholder text color
 *
 * Spacing Tokens:
 * - --spacing-3 (--spacing-3): 0.75rem (input padding)
 *
 * Border Radius Tokens:
 * - --radius-md: 0.5rem (default input corner radius)
 */

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      size: {
        sm: "h-9 px-2.5 py-1.5 text-xs md:text-sm",
        default: "h-10 px-3 py-2 text-base md:text-sm",
        lg: "h-11 px-4 py-2.5 text-base md:text-base",
      },
      inputState: {
        default: "border-input focus-visible:border-ring",
        error: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:border-success focus-visible:ring-success",
        warning: "border-warning focus-visible:border-warning focus-visible:ring-warning",
      },
    },
    defaultVariants: {
      size: "default",
      inputState: "default",
    },
  }
)

const Input = React.forwardRef(({ className, type, size, inputState, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(inputVariants({ size, inputState }), className)}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input, inputVariants }
