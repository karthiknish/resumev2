import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export const Dialog: typeof DialogPrimitive.Root;

export interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  className?: string;
  children?: React.ReactNode;
}

export const DialogContent: React.ForwardRefExoticComponent<DialogContentProps & React.RefAttributes<HTMLDivElement>>;

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const DialogHeader: React.ForwardRefExoticComponent<DialogHeaderProps & React.RefAttributes<HTMLDivElement>>;

export interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  className?: string;
  children?: React.ReactNode;
}

export const DialogTitle: React.ForwardRefExoticComponent<DialogTitleProps & React.RefAttributes<HTMLHeadingElement>>;

export interface DialogTriggerProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> {
  className?: string;
  children?: React.ReactNode;
}

export const DialogTrigger: React.ForwardRefExoticComponent<DialogTriggerProps & React.RefAttributes<HTMLButtonElement>>;

export const DialogPortal: typeof DialogPrimitive.Portal;
export const DialogOverlay: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & React.RefAttributes<HTMLDivElement>>;
export const DialogClose: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> & React.RefAttributes<HTMLButtonElement>>;
export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>;
export const DialogDescription: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> & React.RefAttributes<HTMLParagraphElement>>;
