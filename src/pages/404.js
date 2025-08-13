import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>404 Not Found - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist or has been moved."
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
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl w-full space-y-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/10 to-cyan-200/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-200/10 to-emerald-200/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-orange-200/10 to-yellow-200/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Status indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-100/80 to-orange-100/80 border border-red-200/50 rounded-full text-red-700 text-sm font-semibold mb-8 shadow-lg backdrop-blur-sm"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                >
                  🚫
                </motion.span>
                <span>Page Not Found</span>
              </motion.div>

              {/* 404 Number */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-8xl md:text-9xl font-black mb-6 leading-none"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  404
                </span>
              </motion.div>

              {/* Title */}
              <h1
                className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Oops! Page Not Found
                </span>
              </h1>

              {/* Divider */}
              <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-orange-400 mx-auto mb-10 rounded-full"></div>

              {/* Content Card */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-5xl mb-6 text-red-500"
                >
                  🤔
                </motion.div>

                <h2
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  The page you're looking for doesn't exist
                </h2>

                <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 font-medium leading-relaxed">
                  The page you're trying to reach has been moved, deleted, or
                  never existed. Don't worry, let's get you back on track!
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                      <span className="text-xl">🏠</span>
                      Go Home
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

                  <Link href="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                      <span className="text-xl">📧</span>
                      Contact Us
                    </motion.button>
                  </Link>
                </div>

                {/* Search suggestion */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-4">
                    Looking for something specific?
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search our site..."
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600">
                        🔍
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  If you believe this is an error, please{" "}
                  <Link 
                    href="/contact" 
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 underline"
                  >
                    let us know
                  </Link>
                  !
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
