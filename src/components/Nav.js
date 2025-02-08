import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
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
    <header className="bg-black shadow-md">
      <nav className="container mx-auto px-6 py-4">
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
              onClick={toggleMenu}
              className="text-white hover:text-gray-300"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Menu & Mobile Menu Content */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            className={`md:flex md:items-center md:space-x-4 fixed md:relative inset-0 md:inset-auto h-screen md:h-auto w-full md:w-auto bg-black md:bg-transparent z-50 flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 ${
              isOpen ? "" : "hidden"
            }`}
          >
            {/* Close Button for Mobile */}
            <div className="absolute top-6 right-6 md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-gray-300"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Navigation Links */}
            <motion.div variants={itemVariants}>
              <Link
                href="/projects"
                className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                onClick={() => setIsOpen(false)}
              >
                Projects
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/about"
                className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/blog"
                className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/contact"
                className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </motion.div>

            {/* Conditional Rendering for Admin/Sign In */}
            {session ? (
              <>
                <motion.div variants={itemVariants}>
                  <Link
                    href="/admin"
                    className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                </motion.div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <motion.div variants={itemVariants}>
                <Link
                  href="/signin"
                  className="block md:inline-block py-2 px-4 text-white hover:text-gray-300 text-xl md:text-base"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
