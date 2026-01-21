import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}

export const Label: React.FC<LabelProps>;
