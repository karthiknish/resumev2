import * as React from "react";

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof import("@radix-ui/react-switch").Root> {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  children?: React.ReactNode;
}

export const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>;
