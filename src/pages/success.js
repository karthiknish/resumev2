import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

export default function Success() {
  return (
    <>
      <Head>
        <title>Message Sent Successfully</title>
        <meta
          name="description"
          content="Confirmation page for contact form submission."
        />
      </Head>
      <PageContainer>
        <div className="relative min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="relative z-10 p-10 bg-black/60 backdrop-blur-md rounded-xl shadow-2xl border border-green-500/30 max-w-lg"
          >
            <FadeIn>
              <div className="text-center mb-10">
                <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Message Sent
                </h1>
                <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 max-w-2xl mx-auto">
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

                <h2 className="text-2xl font-bold text-blue-400 mb-4 text-center">
                  Thank You for Reaching Out!
                </h2>

                <p className="text-gray-300 text-lg mb-8 text-center">
                  I appreciate you taking the time to contact me. I'll review
                  your message and get back to you as soon as possible.
                </p>

                <div className="text-center">
                  <Link
                    href="/"
                    className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
                  >
                    Return to Homepage →
                  </Link>
                </div>
              </div>
            </FadeIn>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
