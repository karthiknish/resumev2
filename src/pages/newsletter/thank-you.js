import Head from "next/head";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Archive, Share2, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsletterThankYou() {
  return (
    <>
      <Head>
        <title>Thank You for Subscribing! - Karthik Nishanth</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Thank you for subscribing to our newsletter!"
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
          className="min-h-screen relative flex items-center justify-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-brandSecondary/10"></div>

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
                  📧
                </motion.span>
                <span>Newsletter Subscription</span>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-8xl md:text-9xl mb-6"
              ></motion.div>

              <h1
                className="text-4xl md:text-6xl font-black text-gray-900 mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  You're All Set!
                </span>
              </h1>

              <div className="w-32 h-2 bg-gradient-to-r from-green-400 to-emerald-400 mx-auto mb-8 rounded-full shadow-lg"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border-2 border-green-200 p-12 rounded-3xl shadow-2xl max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 120,
                }}
                className="text-center mb-8"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                </div>

                <h2
                  className="text-3xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Thank You for Subscribing!
                  </span>
                </h2>

                <p className="text-gray-700 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                  You're now part of our community! Keep an eye on your inbox
                  for the latest articles, insights, development tips, and
                  exclusive updates delivered straight to you.
                </p>
              </motion.div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
                <h3
                  className="font-bold text-green-800 mb-3 text-center"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  What to expect:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-700 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span></span> Weekly tech insights
                  </div>
                  <div className="flex items-center gap-2">
                    <span></span> Development tutorials
                  </div>
                  <div className="flex items-center gap-2">
                    <span></span> Industry updates
                  </div>
                  <div className="flex items-center gap-2">
                    <span></span> Project spotlights
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔥</span> Exclusive content
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📱</span> Career tips
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                <Link href="/blog">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-brandSecondary hover:bg-brandSecondary/90 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span className="text-lg"></span>
                    Read Latest Posts
                  </motion.button>
                </Link>

                <Link href="/newsletter/preferences">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Manage Preferences
                  </motion.button>
                </Link>

                <Link href="/newsletter/archive">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border-2 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    View Archive
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="bg-white/50 backdrop-blur-sm border-2 border-blue-200 p-6 rounded-2xl"
              >
                <div className="text-center mb-4">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <span className="bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent">
                      Share the Love! 💙
                    </span>
                  </h3>
                  <p className="text-gray-700 font-medium">
                    Help your friends discover great content too
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.a
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    href="https://twitter.com/intent/tweet?text=Check%20out%20Karthik%20Nishanth's%20newsletter%20for%20great%20tech%20insights!%20https://karthiknish.com/newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Twitter className="w-4 h-4" />
                    Share on Twitter
                  </motion.a>

                  <motion.a
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    href="mailto:?subject=Subscribe%20to%20Karthik%20Nishanth's%20Newsletter&body=Hey,%20I%20thought%20you'd%20enjoy%20Karthik's%20newsletter%20on%20tech%20and%20development.%20Sign%20up%20here:%20https://karthiknish.com/newsletter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-4 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share via Email
                  </motion.a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 pt-6 border-t-2 border-green-100 text-center"
              >
                <p className="text-gray-600 text-sm font-medium flex items-center justify-center gap-2">
                  <span></span>
                  Welcome to the community! Let's build something amazing
                  together.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
