import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

function FourOhFour() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-black">
      <Head>
        <title>404 Not Found // Karthik Nishanth</title>
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto p-8 relative text-center gap-6 my-auto z-30 border border-gray-700 rounded-lg backdrop-blur-sm bg-black/50 flex flex-col"
      >
        <h1 className="text-white text-5xl font-bold font-calendas">
          404 Error
        </h1>
        <p className="text-gray-300 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-lg font-calendas"
          href="/"
        >
          Return to homepage <span className="ml-1">&#8594;</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default FourOhFour;
