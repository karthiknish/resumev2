import Link from "next/link";
import { motion } from "framer-motion";
function Nav() {
  return (
    <header className="p-4 bg-black flex md:p-6">
      <Link href="/">
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-grow font-extrabold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 cursor-pointer"
        >
          Karthik Nishanth
        </motion.h1>
      </Link>

      <div className="w-full my-auto overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 0.5 }}
          className="h-1 w-full my-1 bg-red-500 transform skew-x-12"
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "25%" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-1 w-full my-1 bg-green-500 transform skew-x-12"
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "50%" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="h-1 w-full bg-blue-500 transform skew-x-12"
        />
      </div>
    </header>
  );
}

export default Nav;
