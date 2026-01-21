import * as React from "react";

// Label component
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
  htmlFor?: string;
  children?: React.ReactNode;
}
export const Label: React.FC<LabelProps>;

// Card components
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Card: React.FC<CardProps>;

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const CardHeader: React.FC<CardHeaderProps>;

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}
export const CardTitle: React.FC<CardTitleProps>;

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}
export const CardDescription: React.FC<CardDescriptionProps>;

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const CardContent: React.FC<CardContentProps>;

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const CardFooter: React.FC<CardFooterProps>;

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}
export const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

// Switch component
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
}
export const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLInputElement>>;

// Slider component  
export interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}
export const Slider: React.FC<SliderProps>;

// Select components
export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export const SelectTrigger: React.FC<SelectTriggerProps>;

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  placeholder?: string;
}
export const SelectValue: React.FC<SelectValueProps>;

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const SelectContent: React.FC<SelectContentProps>;

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  value: string;
}
export const SelectItem: React.FC<SelectItemProps>;

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}
export const Select: React.FC<SelectProps>;

// Tabs components
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}
export const Tabs: React.FC<TabsProps>;

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const TabsList: React.FC<TabsListProps>;

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  value: string;
}
export const TabsTrigger: React.FC<TabsTriggerProps>;

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  value: string;
}
export const TabsContent: React.FC<TabsContentProps>;

// Alert Dialog components
export interface AlertDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
export const AlertDialog: React.FC<AlertDialogProps>;

export interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const AlertDialogContent: React.FC<AlertDialogContentProps>;

// Dialog components
export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}
export const Dialog: React.FC<DialogProps>;

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}
export const DialogContent: React.FC<DialogContentProps>;

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}
export const DialogHeader: React.FC<DialogHeaderProps>;

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children?: React.ReactNode;
}
export const DialogTitle: React.FC<DialogTitleProps>;

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children?: React.ReactNode;
}
export const DialogTrigger: React.FC<DialogTriggerProps>;

// Tooltip component
export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: React.ReactNode;
  className?: string;
}
export const Tooltip: React.FC<TooltipProps>;

// Badge component
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Badge: React.FC<BadgeProps>;

// Avatar components
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const Avatar: React.FC<AvatarProps>;

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}
export const AvatarImage: React.ForwardRefExoticComponent<AvatarImageProps & React.RefAttributes<HTMLImageElement>>;

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
export const AvatarFallback: React.FC<AvatarFallbackProps>;
