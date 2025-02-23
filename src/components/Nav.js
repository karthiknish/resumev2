import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const isHome = router.pathname === "/";

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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`${isHome ? "" : "bg-black"} shadow-md fixed w-full z-50`}
    >
      <nav
        className="max-w-[90rem] w-full mx-auto px-4 sm:px-6 py-4"
        id="mobile-nav"
      >
        <div className="flex justify-between items-center">
          <Link href="/">
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-bold text-white cursor-pointer"
            >
              <Image
                src="/Logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </motion.span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Navigation Links - Desktop & Mobile */}
          <div
            className={`${
              isOpen ? "flex" : "hidden md:flex"
            } flex-col md:flex-row absolute md:relative top-0 left-0 md:top-auto md:left-auto w-full md:w-auto h-screen md:h-auto bg-black md:bg-transparent items-center justify-center md:justify-end space-y-8 md:space-y-0 md:space-x-8 p-8 md:p-0 z-40`}
          >
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white md:hidden"
            >
              <FaTimes size={24} />
            </button>

            <Link
              href="/"
              className="text-white hover:text-gray-300 text-xl md:text-base font-calendas"
              onClick={handleLinkClick}
            >
              Home
            </Link>

            <Link
              href="/blog"
              className="text-white hover:text-gray-300 text-xl md:text-base font-calendas"
              onClick={handleLinkClick}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="text-white hover:text-gray-300 text-xl md:text-base font-calendas"
              onClick={handleLinkClick}
            >
              Contact
            </Link>

            {session ? (
              <>
                <Link
                  href="/admin"
                  className="text-white hover:text-gray-300 text-xl md:text-base font-calendas"
                  onClick={handleLinkClick}
                >
                  Admin
                </Link>

                <button
                  onClick={() => {
                    handleSignOut();
                    handleLinkClick();
                  }}
                  className="text-white hover:text-gray-300 text-xl md:text-base font-calendas"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="text-white hover:text-gray-300 text-xl md:text-base font-calendas"
                onClick={handleLinkClick}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
