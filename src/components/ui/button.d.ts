import * as React from "react";

export type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "success"
  | "warning"
  | "info"
  | "ghost-destructive"
  | "outline-success"
  | "outline-warning"
  | "outline-info";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

export const buttonVariants: any;
