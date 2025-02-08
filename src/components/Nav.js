import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import Image from "next/image";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/signin");
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
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <div
            className={`md:flex md:space-x-4 ${
              isOpen ? "block" : "hidden"
            } absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-black md:bg-transparent shadow-md md:shadow-none`}
          >
            <Link
              href="/projects"
              className="block md:inline-block py-2 px-4 text-white hover:text-gray-300"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="block md:inline-block py-2 px-4 text-white hover:text-gray-300"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block md:inline-block py-2 px-4 text-white hover:text-gray-300"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="block md:inline-block py-2 px-4 text-white hover:text-gray-300"
            >
              Contact
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleSignOut}
                className="block md:inline-block py-2 px-4 text-white hover:text-gray-300"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
