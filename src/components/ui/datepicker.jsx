import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * DatePicker Component
 *
 * A date picker component that combines a calendar popover with time input.
 * Uses semantic design tokens from src/styles/theme/tokens.css:
 * - --color-background: Background color for the popover
 * - --color-foreground: Text color
 * - --color-muted: Background color for non-selected days
 * - --color-border: Border color for the input
 * - --color-ring: Focus ring color
 *
 * @param {Date|string|null} value - The selected date value
 * @param {function} onChange - Callback when date changes (receives Date object or null)
 * @param {boolean} disabled - Whether the picker is disabled
 * @param {string} placeholder - Placeholder text for the input
 * @param {boolean} showTime - Whether to show time input (default: true)
 * @param {string} className - Additional CSS classes
 * @param {string} id - ID attribute for the input wrapper
 * @param {string} label - Optional label for the picker
 */
function DatePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "Pick a date",
  showTime = true,
  className,
  id,
  label,
  ...props
}) {
  // Parse the value to a Date object
  const parsedValue = React.useMemo(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    return new Date(value);
  }, [value]);

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    if (!date) {
      onChange(null);
      return;
    }

    // Preserve the time from the current value if it exists
    if (parsedValue && showTime) {
      const newDate = new Date(date);
      newDate.setHours(parsedValue.getHours());
      newDate.setMinutes(parsedValue.getMinutes());
      onChange(newDate);
    } else {
      // Set default time to 9:00 AM if no time was set
      if (showTime) {
        const newDate = new Date(date);
        newDate.setHours(9, 0, 0, 0);
        onChange(newDate);
      } else {
        onChange(date);
      }
    }
  };

  // Handle time input change
  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    if (!timeValue || !parsedValue) {
      return;
    }

    const [hours, minutes] = timeValue.split(":").map(Number);
    const newDate = new Date(parsedValue);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    onChange(newDate);
  };

  // Format the date for display
  const displayValue = React.useMemo(() => {
    if (!parsedValue) return "";
    return format(parsedValue, showTime ? "PPP p" : "PPP");
  }, [parsedValue, showTime]);

  // Format time input value (HH:MM)
  const timeValue = React.useMemo(() => {
    if (!parsedValue) return "";
    return format(parsedValue, "HH:mm");
  }, [parsedValue]);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("space-y-2", className)} id={id} {...props}>
      {label && (
        <Label className="text-foreground">{label}</Label>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              "bg-background border-input focus:border-ring focus:ring-ring",
              "hover:bg-accent hover:text-accent-foreground",
              !parsedValue && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-50"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {parsedValue ? displayValue : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background border-border" align="start">
          <Calendar
            mode="single"
            selected={parsedValue}
            onSelect={handleDateSelect}
            disabled={(date) =>
              disabled || date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            initialFocus
          />
          {showTime && parsedValue && (
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Label htmlFor="time-input" className="text-sm text-muted-foreground">
                  Time:
                </Label>
                <Input
                  id="time-input"
                  type="time"
                  value={timeValue}
                  onChange={handleTimeChange}
                  className="flex-1 bg-background border-input focus:border-ring focus:ring-ring"
                />
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

DatePicker.displayName = "DatePicker";

export { DatePicker };
