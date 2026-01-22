import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import { signOut } from "@/lib/authUtils";
import useDebounce from "@/hooks/useDebounce";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import {
  SlideInRight,
  FadeIn,
  HoverCard,
} from "./animations/MotionComponents";
import { Loader2 } from "lucide-react";
import { SearchResult } from "@/types";

// Dynamically import the SearchOverlay component
const SearchOverlay = dynamic(() => import("./SearchOverlay"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[110]">
      <Loader2 className="h-8 w-8 text-white animate-spin" />
    </div>
  ),
});

export default function Nav() {
  const router = useRouter();
  const isHome = router.pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(() => !isHome);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const navFontClass = "font-heading";
  const iconButtonClass = "text-muted-foreground hover:text-foreground hover:bg-secondary/60";
  const navShellClasses = hasScrolled
    ? "bg-[#ffffff] text-foreground shadow-sm border-border"
    : "bg-[#ffffff] text-foreground border-transparent";
  const mobileContainerClasses = "bg-background/70 backdrop-blur-lg text-foreground border-border";
  const mobileLinkBaseClass = "text-muted-foreground hover:bg-secondary/60 hover:text-foreground";
  const mobileLinkActiveClass = "text-primary bg-secondary/60";
  const mobileSignOutClass = "text-muted-foreground hover:text-foreground hover:bg-secondary/60";


  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Navigation links data
  const navLinks = [
    { href: "/", label: "Home", delay: 0.2 },
    { href: "/about", label: "About", delay: 0.3 },
    { href: "/services", label: "Services", delay: 0.4 },
    { href: "/resources", label: "Resources", delay: 0.5 },
    { href: "/blog", label: "Blog", delay: 0.6 },
    { href: "/bytes", label: "Bytes", delay: 0.7 },
    { href: "/contact", label: "Contact", delay: 0.8 },
  ];

  useEffect(() => {
    if (!isHome) {
      setHasScrolled(true);
      return undefined;
    }

    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById("mobile-nav");
      if (nav && !nav.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  // Effect to fetch search results when debounced query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.results || []);
        } else {
          console.error("Search API error:", response.statusText);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    if (isSearchOpen) {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, isSearchOpen]);

  // Effect to handle body scroll lock when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setIsSearchOpen(false);
      }
      return next;
    });
  };

  const toggleSearch = useCallback(() => {
    const nextState = !isSearchOpen;
    setIsSearchOpen(nextState);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);

    if (nextState) {
      setIsOpen(false);
      setTimeout(() => searchInputRef.current?.focus(), 120);
    }
  }, [isSearchOpen]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleResultClick = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setIsOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 w-full z-[100] border-b transition-all duration-300 ${navShellClasses}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 md:py-5">
          <div className="flex justify-between items-center">
            <FadeIn delay={0.1}>
              <Link href="/" className="flex items-center">
                <motion.div className="relative">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={56}
                    height={56}
                    sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                    className="mr-2 sm:mr-3 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                    priority
                    unoptimized
                  />
                </motion.div>
              </Link>
            </FadeIn>

            {/* Desktop Menu & Search Icon */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navLinks.map((link) => (
                <SlideInRight key={link.href} delay={link.delay}>
                  <HoverCard scale={1.05}>
                    <Link
                      href={link.href}
                      className={`text-base lg:text-lg relative group font-heading transition-colors duration-200 ${
                        (link.href === "/" && router.pathname === "/") ||
                        (link.href !== "/" &&
                          (router.pathname === link.href ||
                            (link.href === "/blog" &&
                              router.pathname.startsWith("/blog")) ||
                            (link.href === "/bytes" &&
                              router.pathname.startsWith("/bytes"))))
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </HoverCard>
                </SlideInRight>
              ))}

              {/* Authentication Links */}
              {session ? (
                <>
                  {session?.user?.role === "admin" ? (
                    <SlideInRight delay={1.0}>
                      <HoverCard scale={1.05}>
                        <Link
                          href="/admin"
                          className={`text-lg font-heading relative group transition-colors duration-200 ${
                            router.pathname.startsWith("/admin")
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Admin
                        </Link>
                      </HoverCard>
                    </SlideInRight>
                  ) : null}

                  <SlideInRight delay={1.1}>
                    <HoverCard scale={1.05}>
                      <button
                        onClick={handleSignOut}
                        className="text-lg font-heading transition-colors duration-200 relative group text-muted-foreground hover:text-foreground"
                      >
                        Sign Out
                      </button>
                    </HoverCard>
                  </SlideInRight>
                </>
              ) : null}

              {/* Search Icon */}
              <motion.button
                onClick={toggleSearch}
                className={`${iconButtonClass} transition-colors duration-200 p-2 lg:p-3 rounded-xl group relative`}
                aria-label="Open Search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSearch className="w-5 h-5 lg:w-6 lg:h-6" />
                <kbd className="hidden lg:inline-flex absolute -top-1 -right-1 items-center justify-center w-5 h-5 text-[10px] font-mono rounded-full bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] opacity-0 group-hover:opacity-100 transition-opacity">
                  ⌘K
                </kbd>
              </motion.button>
            </div>

            {/* Mobile Menu Button & Theme Switcher */}
            <motion.div className="md:hidden flex items-center space-x-2 sm:space-x-3">
              <motion.button
                onClick={toggleSearch}
                className={`${iconButtonClass} transition-colors duration-200 p-2 rounded-xl`}
                aria-label="Open Search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSearch className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
              <motion.button
                onClick={toggleMenu}
                className={`${iconButtonClass} transition-colors duration-200 p-2 rounded-xl`}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {isOpen ? (
                  <FaTimes className="w-6 h-6 sm:w-7 sm:h-7" />
                ) : (
                  <FaBars className="w-6 h-6 sm:w-7 sm:h-7" />
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            className={`md:hidden pt-6 sm:pt-8 pb-6 sm:pb-8 shadow-2xl z-[100] fixed top-[72px] sm:top-[80px] md:top-[88px] left-0 right-0 h-[calc(100vh-72px)] sm:h-[calc(100vh-80px)] md:h-[calc(100vh-88px)] w-full overflow-y-auto border-t ${mobileContainerClasses}`}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full pt-2 sm:pt-4 items-center px-4">
              {navLinks.map((link) => {
                const isActive =
                  (link.href === "/" && router.pathname === "/") ||
                  (link.href !== "/" &&
                    (router.pathname === link.href ||
                      (link.href === "/blog" &&
                        router.pathname.startsWith("/blog")) ||
                      (link.href === "/bytes" &&
                        router.pathname.startsWith("/bytes"))));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-3 sm:py-4 px-4 sm:px-6 text-center text-xl sm:text-2xl font-semibold ${navFontClass} rounded-xl sm:rounded-2xl mx-2 sm:mx-4 mb-2 transition-colors duration-200 w-full max-w-xs ${
                      isActive ? mobileLinkActiveClass : mobileLinkBaseClass
                    }`}
                    onClick={handleLinkClick}
                  >
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                );
              })}
              {/* Authentication Mobile Links */}
              {session ? (
                <>
                  {session?.user?.role === "admin" ? (
                    <Link
                      href="/admin"
                      className={`block py-3 sm:py-4 px-4 sm:px-6 text-center text-xl sm:text-2xl font-semibold ${navFontClass} rounded-xl sm:rounded-2xl mx-2 sm:mx-4 mb-2 transition-colors duration-200 w-full max-w-xs ${
                        router.pathname.startsWith("/admin")
                          ? mobileLinkActiveClass
                          : mobileLinkBaseClass
                      }`}
                      onClick={handleLinkClick}
                    >
                      <motion.span
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Admin
                      </motion.span>
                    </Link>
                  ) : null}

                  <button
                    className={`block py-3 sm:py-4 px-4 sm:px-6 text-center text-xl sm:text-2xl font-semibold ${navFontClass} rounded-xl sm:rounded-2xl mx-2 sm:mx-4 mt-auto transition-colors duration-200 w-full max-w-xs ${mobileSignOutClass}`}
                    onClick={() => {
                      handleSignOut();
                      handleLinkClick();
                    }}
                  >
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign Out
                    </motion.span>
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            toggleSearch={toggleSearch}
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            isSearching={isSearching}
            searchResults={searchResults}
            handleResultClick={handleResultClick}
            debouncedSearchQuery={debouncedSearchQuery}
          />
        )}
      </AnimatePresence>
    </>
  );
}
