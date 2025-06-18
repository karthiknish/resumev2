import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

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
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-100 to-orange-100 border border-red-200 rounded-full text-red-700 text-sm font-semibold mb-6 shadow-lg"
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

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-9xl md:text-[12rem] font-black text-gray-900 mb-6 leading-none"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  404
                </span>
              </motion.div>

              <h1
                className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Oops! Page Not Found
                </span>
              </h1>

              <div className="w-32 h-2 bg-gradient-to-r from-red-400 to-orange-400 mx-auto mb-8 rounded-full shadow-lg"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border-2 border-red-200 p-12 rounded-3xl shadow-2xl max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-6xl mb-6"
              >
                🔍
              </motion.div>

              <h2
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                The page you're looking for doesn't exist
              </h2>

              <p className="text-gray-700 text-lg mb-8 font-medium leading-relaxed">
                The page you're trying to reach has been moved, deleted, or
                never existed. Don't worry, let's get you back on track!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
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
                    className="bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    <span className="text-xl">📧</span>
                    Contact Us
                  </motion.button>
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 pt-6 border-t-2 border-red-100"
              >
                <p className="text-gray-600 text-sm font-medium">
                  If you believe this is an error, please let us know!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
