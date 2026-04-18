import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  BookOpen,
  Coffee,
  FileText,
  Home,
  LogOut,
  Search,
  type LucideProps,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { CommandItem as CommandType } from "@/types";

interface CommandGroup {
  title: string;
  items: CommandType[];
}

const iconMap: Record<string, ComponentType<LucideProps>> = {
  Home,
  User,
  Briefcase,
  FileText,
  Coffee,
  MessageSquare,
  BookOpen,
  LogOut,
};

export default function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const commandGroups = useMemo((): CommandGroup[] => [
    {
      title: "Navigation",
      items: [
        { icon: "Home", label: "Go to Home", href: "/", shortcut: "⌘H" },
        { icon: "User", label: "Go to About", href: "/about", shortcut: "⌘A" },
        { icon: "Briefcase", label: "Go to Services", href: "/services", shortcut: "⌘S" },
        { icon: "FileText", label: "Go to Blog", href: "/blog", shortcut: "⌘B" },
        { icon: "Coffee", label: "Go to Bytes", href: "/bytes", shortcut: "⌘Y" },
        { icon: "BookOpen", label: "Go to Resources", href: "/resources", shortcut: "⌘R" },
        { icon: "MessageSquare", label: "Go to Contact", href: "/contact", shortcut: "⌘C" },
      ],
    },
    ...(session
      ? [
          {
            title: "Account",
            items: [
              {
                icon: "LogOut",
                label: "Sign Out",
                action: async () => {
                  const { signOut } = await import("@/lib/authUtils");
                  await signOut({ callbackUrl: "/" });
                },
              },
            ],
          },
        ]
      : []),
  ], [session]);

  const allItems = useMemo(() => commandGroups.flatMap((group) => group.items), [commandGroups]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
      if (isOpen) {
        if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % allItems.length);
        } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const item = allItems[activeIndex];
          if (item?.href) {
            window.location.href = item.href;
          } else if (item?.action) {
            item.action();
          }
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, allItems]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(0);
  }, []);

  const handleItemClick = useCallback((item: CommandType) => {
    if (item?.href) {
      window.location.href = item.href;
    } else if (item?.action) {
      item.action();
    }
    handleClose();
  }, [handleClose]);

  const CommandItem = ({ icon, label, shortcut, item, active, setActive }: {
    icon?: string | ReactNode;
    label?: string;
    shortcut?: string;
    item: CommandType;
    active: boolean;
    setActive?: () => void;
  }) => {
    const handleClick = () => {
      handleItemClick(item);
    };

    const handleMouseEnter = () => {
      setActive?.();
    };

    const renderIcon = () => {
      if (!icon) return null;
      if (typeof icon === "string") {
        const Icon = iconMap[icon];
        return Icon ? <Icon className="w-5 h-5" /> : null;
      }
      return icon;
    };

    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-accent text-accent-foreground"
            : "hover:bg-accent/50 text-foreground"
        }`}
      >
        {renderIcon()}
        <span className="flex-1 text-left font-medium">{label}</span>
        {shortcut && (
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded bg-muted text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </button>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[min(90dvh,720px)] w-[calc(100vw-1rem)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:w-full",
          "bg-background"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-4">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              type="button"
              onClick={handleClose}
              className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4">
            <AnimatePresence>
              {commandGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const globalIndex = allItems.indexOf(item);
                      return (
                        <CommandItem
                          key={item.label}
                          icon={item.icon}
                          label={item.label}
                          shortcut={item.shortcut}
                          item={item}
                          active={activeIndex === globalIndex}
                          setActive={() => setActiveIndex(globalIndex)}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="shrink-0 border-t border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">
                  ↑↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">
                  ↵
                </kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border">
                  esc
                </kbd>
                to close
              </span>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
