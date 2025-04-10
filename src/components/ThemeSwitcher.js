"use client"; // Required for hooks like useState, useEffect, useTheme

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming you have Shadcn Select components
import { Sun, Moon, Palette, Monitor } from "lucide-react"; // Example icons

const themeOptions = [
  { value: "minimal", label: "Minimal", icon: <Sun className="w-4 h-4" /> },
  { value: "playful", label: "Playful", icon: <Palette className="w-4 h-4" /> },
  {
    value: "dark-hacker",
    label: "Dark Hacker",
    icon: <Moon className="w-4 h-4" />,
  },
  {
    value: "neon-cyberpunk",
    label: "Neon Cyberpunk",
    icon: <Monitor className="w-4 h-4" />,
  },
  {
    value: "studio-ghibli",
    label: "Studio Ghibli",
    icon: <Palette className="w-4 h-4" />,
  }, // Re-using Palette icon
];

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, themes } = useTheme();

  // Ensure component is mounted before rendering UI that depends on theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null during SSR/hydration mismatch phase
    return (
      <div className="w-[150px] h-10 bg-gray-800 rounded-md animate-pulse"></div>
    );
  }

  // Use resolvedTheme to accurately reflect the current theme even if 'system' is set
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <Select value={currentTheme} onValueChange={(value) => setTheme(value)}>
      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white focus:ring-blue-500">
        <SelectValue placeholder="Select Theme" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-white">
        {themeOptions
          .filter((option) => themes.includes(option.value)) // Only show themes enabled in ThemeProvider
          .map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
