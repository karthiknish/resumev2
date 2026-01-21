import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "default" | "lg";
  inputState?: "default" | "error" | "success" | "warning";
  className?: string;
}

export const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

export const inputVariants: any;
