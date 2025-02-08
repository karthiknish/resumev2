"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import Head from "next/head";

export default function Success() {
  return (
    <>
      <Head>
        <title>Message Sent Successfully - Karthik Nishanth</title>
        <meta name="description" content="Thank you for your message" />
      </Head>
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="mb-8"
          >
            <svg
              className="w-20 h-20 mx-auto text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold mb-4 text-white font-calendas">
            Message Sent Successfully!
          </h1>
          <p className="text-lg mb-8 text-gray-300 font-calendas">
            Thank you for reaching out. I'll get back to you as soon as
            possible.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block bg-blue-500 text-white px-8 py-3 rounded-full font-calendas hover:bg-blue-600 transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
