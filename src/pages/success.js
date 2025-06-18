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
        <title>Message Sent Successfully - Karthik Nishanth</title>
        <meta
          name="description"
          content="Confirmation page for contact form submission."
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div
          className="min-h-screen mt-24 relative flex items-center justify-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>

          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-4xl mx-auto px-8"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-full text-green-700 text-sm font-semibold mb-6 shadow-lg"
              >
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                >
                  ✅
                </motion.span>
                <span>Message Delivered!</span>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-8xl md:text-9xl mb-6"
              >
                🎉
              </motion.div>

              <h1
                className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Message Sent Successfully!
                </span>
              </h1>

              <div className="w-32 h-2 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto mb-8 rounded-full shadow-lg"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border-2 border-green-200 p-12 rounded-3xl shadow-2xl max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                  <motion.svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </div>
              </motion.div>

              <h2
                className="text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Thank You for Reaching Out!
                </span>
              </h2>

              <p className="text-gray-700 text-lg mb-8 font-medium leading-relaxed">
                I appreciate you taking the time to contact me. Your message has
                been received successfully, and I'll review it carefully and get
                back to you as soon as possible.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
                <h3
                  className="font-bold text-green-800 mb-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  What happens next?
                </h3>
                <ul className="text-green-700 text-sm space-y-2 font-medium">
                  <li className="flex items-center gap-2">
                    <span>⏰</span> I typically respond within 24-48 hours
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📧</span> You'll receive a response at the email you
                    provided
                  </li>
                  <li className="flex items-center gap-2">
                    <span>💬</span> We can schedule a call if needed for your
                    project
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                  >
                    <span className="text-xl">🏠</span>
                    Return Home
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </Link>

                <Link href="/blog">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    <span className="text-xl">📝</span>
                    Read Blog
                  </motion.button>
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 pt-6 border-t-2 border-green-100"
              >
                <p className="text-gray-600 text-sm font-medium flex items-center justify-center gap-2">
                  <span>📱</span>
                  Prefer to connect directly? Find me on social media!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
