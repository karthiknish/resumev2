import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  User,
  Briefcase,
  FileText,
  Coffee,
  MessageSquare,
  BookOpen,
  LogOut,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function CommandPalette() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const commandGroups = [
    {
      title: "Navigation",
      items: [
        { icon: Home, label: "Go to Home", href: "/", shortcut: "⌘H" },
        { icon: User, label: "Go to About", href: "/about", shortcut: "⌘A" },
        { icon: Briefcase, label: "Go to Services", href: "/services", shortcut: "⌘S" },
        { icon: FileText, label: "Go to Blog", href: "/blog", shortcut: "⌘B" },
        { icon: Coffee, label: "Go to Bytes", href: "/bytes", shortcut: "⌘Y" },
        { icon: BookOpen, label: "Go to Resources", href: "/resources", shortcut: "⌘R" },
        { icon: MessageSquare, label: "Go to Contact", href: "/contact", shortcut: "⌘C" },
      ],
    },
    ...(session
      ? [
          {
            title: "Account",
            items: [
              {
                icon: LogOut,
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
  ];

  const allItems = commandGroups.flatMap((group) => group.items);

  useEffect(() => {
    const handleKeyDown = (e) => {
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

  const handleItemClick = useCallback((item) => {
    if (item?.href) {
      window.location.href = item.href;
    } else if (item?.action) {
      item.action();
    }
    handleClose();
  }, [handleClose]);

  const CommandItem = ({ icon: Icon, label, shortcut, item, active, setActive }) => {
    const handleClick = useCallback(() => {
      handleItemClick(item);
    }, [item, handleItemClick]);

    const handleMouseEnter = useCallback(() => {
      setActive?.();
    }, [setActive]);

    return (
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
          active
            ? "bg-[hsl(var(--color-accent))] text-[hsl(var(--color-accent-foreground))]"
            : "hover:bg-[hsl(var(--color-accent))]/50 text-[hsl(var(--color-foreground))]"
        }`}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <span className="flex-1 text-left font-medium">{label}</span>
        {shortcut && (
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono rounded bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))]">
            {shortcut}
          </kbd>
        )}
      </button>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="p-0 max-w-2xl overflow-hidden bg-[hsl(var(--color-background))]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col max-h-[600px]"
        >
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[hsl(var(--color-border))]">
            <Search className="w-5 h-5 text-[hsl(var(--color-muted-foreground))]" />
            <input
              type="text"
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
              autoFocus
            />
            <button
              onClick={handleClose}
              className="p-1 rounded hover:bg-[hsl(var(--color-accent))] text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 space-y-6">
            <AnimatePresence>
              {commandGroups.map((group, groupIndex) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <h3 className="text-xs font-semibold text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider mb-2 px-4">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item, itemIndex) => {
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

          <div className="px-4 py-3 border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-muted))]/50">
            <div className="flex items-center justify-center gap-4 text-xs text-[hsl(var(--color-muted-foreground))]">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--color-background))] border border-[hsl(var(--color-border))]">
                  ↑↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--color-background))] border border-[hsl(var(--color-border))]">
                  ↵
                </kbd>
                to select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-[hsl(var(--color-background))] border border-[hsl(var(--color-border))]">
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
