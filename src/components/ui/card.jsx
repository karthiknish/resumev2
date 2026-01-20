import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Card Variants - Using Elevation Design Tokens
 *
 * Shadow tokens referenced from src/styles/theme/tokens.css:
 * - flat: --shadow-card-flat (none)
 * - raised: --shadow-card-raised (small elevation)
 * - elevated: --shadow-card-elevated (medium elevation)
 * - floating: --shadow-card-floating (large elevation)
 * - overlay: --shadow-card-overlay (extra large elevation)
 */
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground",
  {
    variants: {
      elevation: {
        flat: "shadow-[var(--shadow-card-flat)]",
        raised: "shadow-[var(--shadow-card-raised)]",
        elevated: "shadow-[var(--shadow-card-elevated)]",
        floating: "shadow-[var(--shadow-card-floating)]",
        overlay: "shadow-[var(--shadow-card-overlay)]",
      },
    },
    defaultVariants: {
      elevation: "raised",
    },
  }
)

const Card = React.forwardRef(({ className, elevation, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ elevation }), className)}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
