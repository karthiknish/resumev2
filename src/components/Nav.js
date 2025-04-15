import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { FaBars, FaTimes, FaSearch, FaTimesCircle } from "react-icons/fa"; // Added FaSearch, FaTimesCircle
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import useDebounce from "@/hooks/useDebounce"; // Make sure this hook exists at this path
import dynamic from "next/dynamic"; // <-- Add this import
import {
  SlideInRight,
  // SlideUp, // Not used directly here anymore
  FadeIn,
  HoverCard,
  // MotionDiv, // Not used directly here anymore
} from "./animations/MotionComponents";
import { Loader2 } from "lucide-react";

// Dynamically import the SearchOverlay component
const SearchOverlay = dynamic(() => import("./SearchOverlay"), {
  ssr: false, // Disable server-side rendering for this component
  loading: () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[110]">
      <Loader2 className="h-8 w-8 text-white animate-spin" />
    </div>
  ), // Optional loading state
});

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Search overlay state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const isHome = router.pathname === "/";
  const searchInputRef = useRef(null); // Ref for search input focus

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // 300ms debounce

  // Navigation links data
  const navLinks = [
    { href: "/", label: "Home", delay: 0.2 },
    { href: "/about", label: "About", delay: 0.3 },
    { href: "/services", label: "Services", delay: 0.4 },
    { href: "/resources", label: "Resources", delay: 0.5 },
    { href: "/blog", label: "Blog", delay: 0.6 },
    { href: "/bytes", label: "Bytes", delay: 0.7 },
    // { href: "/notes", label: "Notes", delay: 0.8 }, // Removed Notes link
    { href: "/contact", label: "Contact", delay: 0.8 }, // Adjusted delay back
  ];

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.getElementById("mobile-nav");
      if (nav && !nav.contains(event.target)) {
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

  // Effect for navbar color change on scroll
  useEffect(() => {
    const changeNavbarColor = () => {
      if (window.scrollY >= 80) {
        setColorChange(true);
      } else {
        setColorChange(false);
      }
    };
    window.addEventListener("scroll", changeNavbarColor);
    return () => {
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, []);

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
      // Only fetch if search is open
      fetchSearchResults();
    } else {
      setSearchResults([]); // Clear results when search closes
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, isSearchOpen]); // Depend on debounced query and open state

  // Effect to handle body scroll lock when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup function to reset overflow when component unmounts
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
    setIsOpen(!isOpen);
    if (!isOpen) setIsSearchOpen(false); // Close search if opening mobile menu
  };

  // Wrap toggleSearch in useCallback
  const toggleSearch = useCallback(() => {
    const nextState = !isSearchOpen;
    setIsSearchOpen(nextState);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    if (nextState) {
      setIsOpen(false); // Close mobile menu if opening search
      // Focus input when opening search (delay slightly for transition)
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]); // Dependency: isSearchOpen

  // Wrap handleSearchChange in useCallback
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []); // No dependencies needed

  // Wrap handleResultClick in useCallback
  const handleResultClick = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setIsOpen(false);
  }, []); // No dependencies needed

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 w-full z-[100] ${
          colorChange || !isHome
            ? "bg-black bg-opacity-90 backdrop-blur-sm shadow-lg"
            : "bg-black bg-opacity-80"
        } transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <FadeIn delay={0.1}>
              <Link href="/" className="flex items-center">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  width={50}
                  height={50}
                  className="mr-2"
                />
              </Link>
            </FadeIn>

            {/* Desktop Menu & Search Icon */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Regular Nav Links */}
              {navLinks.map((link) => (
                <SlideInRight key={link.href} delay={link.delay}>
                  <HoverCard scale={1.05}>
                    <Link
                      href={link.href}
                      className={`text-lg ${
                        (link.href === "/" && router.pathname === "/") || // Home check
                        (link.href !== "/" && // Exclude home for startsWith checks
                          (router.pathname === link.href || // Exact match
                            (link.href === "/blog" &&
                              router.pathname.startsWith("/blog")) || // Blog section
                            (link.href === "/bytes" &&
                              router.pathname.startsWith("/bytes")))) // Bytes section
                          ? "text-blue-400"
                          : "text-white"
                      } hover:text-blue-400 transition-colors`}
                    >
                      {link.label}
                    </Link>
                  </HoverCard>
                </SlideInRight>
              ))}

              {/* Authentication Links */}
              {session && (
                <>
                  {session?.user?.role === "admin" && (
                    <SlideInRight delay={1.0}>
                      <HoverCard scale={1.05}>
                        <Link
                          href="/admin"
                          className={`text-lg ${
                            router.pathname.startsWith("/admin")
                              ? "text-blue-400"
                              : "text-white"
                          } hover:text-blue-400 transition-colors`}
                        >
                          Admin
                        </Link>
                      </HoverCard>
                    </SlideInRight>
                  )}

                  <SlideInRight delay={1.1}>
                    <HoverCard scale={1.05}>
                      <button
                        onClick={handleSignOut}
                        className="text-lg text-white hover:text-blue-400 transition-colors"
                      >
                        Sign Out
                      </button>
                    </HoverCard>
                  </SlideInRight>
                </>
              )}

              {/* Search Icon */}
              <motion.button
                onClick={toggleSearch}
                className="text-white hover:text-blue-400 transition-colors p-2"
                aria-label="Open Search"
                whileTap={{ scale: 0.9 }}
              >
                <FaSearch size={20} />
              </motion.button>
            </div>

            {/* Mobile Menu Button & Theme Switcher */}
            <motion.div className="md:hidden flex items-center space-x-4">
              {/* Search Icon (Mobile) */}
              <motion.button
                onClick={toggleSearch}
                className="text-white hover:text-blue-400 transition-colors p-1"
                aria-label="Open Search"
                whileTap={{ scale: 0.9 }}
              >
                <FaSearch size={22} />
              </motion.button>
              {/* Hamburger Icon */}
              <button onClick={toggleMenu} className="text-white text-2xl p-1">
                {isOpen ? <FaTimes /> : <FaBars />}
              </button>
              {/* Theme Switcher (Mobile - Optional, could also go in mobile menu) */}
              {/* <div className="ml-2"><ThemeSwitcher /></div> */}
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            className="md:hidden bg-black text-white pt-4 pb-8 shadow-lg z-[100] fixed top-[80px] left-0 right-0 h-[calc(100vh-80px)] w-full overflow-y-auto" // Adjusted height
            initial={{ opacity: 0, x: "100%" }} // Slide in from right
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col h-full pt-4 items-center">
              {" "}
              {/* Centered items */}
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={`block py-3 px-4 text-center text-xl ${
                    (link.href === "/" && router.pathname === "/") || // Home check
                    (link.href !== "/" && // Exclude home for startsWith checks
                      (router.pathname === link.href || // Exact match
                        (link.href === "/blog" &&
                          router.pathname.startsWith("/blog")) || // Blog section
                        (link.href === "/bytes" &&
                          router.pathname.startsWith("/bytes")))) // Bytes section
                      ? "text-blue-400"
                      : "text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </motion.a>
              ))}
              {/* Authentication Mobile Links */}
              {session && (
                <>
                  {session?.user?.role === "admin" && (
                    <motion.a
                      href="/admin"
                      className={`block py-3 px-4 text-center text-xl ${
                        router.pathname.startsWith("/admin")
                          ? "text-blue-400"
                          : "text-white"
                      }`}
                      onClick={handleLinkClick}
                    >
                      Admin
                    </motion.a>
                  )}

                  <motion.a
                    href="#"
                    className="block py-3 px-4 text-white text-center text-xl"
                    onClick={() => {
                      handleSignOut();
                      handleLinkClick();
                    }}
                  >
                    Sign Out
                  </motion.a>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render the dynamically imported Search Overlay */}
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
