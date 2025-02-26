import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import {
  SlideInRight,
  SlideUp,
  FadeIn,
  HoverCard,
  MotionDiv,
} from "./animations/MotionComponents";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [colorChange, setColorChange] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const isHome = router.pathname === "/";

  // Navigation links data - updated to only include available pages
  const navLinks = [
    { href: "/", label: "Home", delay: 0.2 },
    { href: "/about", label: "About", delay: 0.3 },
    { href: "/services", label: "Services", delay: 0.4 },
    { href: "/resources", label: "Resources", delay: 0.5 },
    { href: "/blog", label: "Blog", delay: 0.6 },
    { href: "/skills", label: "Skills", delay: 0.7 },
    { href: "/contact", label: "Contact", delay: 0.8 },
    { href: "/linkedin-manager", label: "LinkedIn", delay: 0.9 },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const nav = document.getElementById("mobile-nav");
      if (nav && !nav.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.nav
      className={`mt-10 fixed w-full z-50 ${
        colorChange || !isHome
          ? "bg-black bg-opacity-80 backdrop-blur-sm shadow-lg"
          : "bg-black"
      } transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-2">
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

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <SlideInRight key={link.href} delay={link.delay}>
                <HoverCard scale={1.05}>
                  <Link
                    href={link.href}
                    className={`text-lg ${
                      (link.href === "/" && router.pathname === "/") ||
                      (link.href !== "/" &&
                        (router.pathname === link.href ||
                          (link.href === "/blog" &&
                            router.pathname.startsWith("/blog"))))
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
            {session ? (
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
            ) : (
              <SlideInRight delay={0.9}>
                <HoverCard scale={1.05}>
                  <Link
                    href="/signin"
                    className={`text-lg ${
                      router.pathname === "/signin"
                        ? "text-blue-400"
                        : "text-white"
                    } hover:text-blue-400 transition-colors`}
                  >
                    Sign In
                  </Link>
                </HoverCard>
              </SlideInRight>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.div
            className="md:hidden cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <button onClick={toggleMenu} className="text-white text-2xl">
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            className="md:hidden bg-gray-900 text-white pt-4 pb-8 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`block py-4 px-4 ${
                  (link.href === "/" && router.pathname === "/") ||
                  (link.href !== "/" &&
                    (router.pathname === link.href ||
                      (link.href === "/blog" &&
                        router.pathname.startsWith("/blog"))))
                    ? "text-blue-400"
                    : "text-white"
                }`}
                onClick={handleLinkClick}
              >
                {link.label}
              </motion.a>
            ))}

            {/* Authentication Mobile Links */}
            {session ? (
              <>
                <motion.a
                  href="/profile"
                  className={`block py-4 px-4 ${
                    router.pathname === "/profile"
                      ? "text-blue-400"
                      : "text-white"
                  }`}
                  onClick={handleLinkClick}
                >
                  Profile
                </motion.a>

                {session?.user?.role === "admin" && (
                  <motion.a
                    href="/admin"
                    className={`block py-4 px-4 ${
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
                  className="block py-4 px-4 text-white"
                  onClick={() => {
                    handleSignOut();
                    handleLinkClick();
                  }}
                >
                  Sign Out
                </motion.a>
              </>
            ) : (
              <motion.a
                href="/signin"
                className={`block py-4 px-4 ${
                  router.pathname === "/signin" ? "text-blue-400" : "text-white"
                }`}
                onClick={handleLinkClick}
              >
                Sign In
              </motion.a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
