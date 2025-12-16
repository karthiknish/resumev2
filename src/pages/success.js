import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { CheckCircle, Home, BookOpen, Clock, Mail, Calendar } from "lucide-react";

export default function Success() {
  return (
    <>
      <Head>
        <title>Message Sent Successfully - Karthik Nishanth</title>
        <meta
          name="description"
          content="Confirmation page for contact form submission."
        />
      </Head>
      <PageContainer>
        <div
          className="min-h-screen mt-24 relative flex items-center justify-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-2xl mx-auto px-6"
          >
            {/* Success Card */}
            <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-xl text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150,
                }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </motion.div>
                </div>
              </motion.div>

              {/* Heading */}
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Message Sent Successfully
              </h1>

              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-md mx-auto">
                Thank you for reaching out. Your message has been received and I'll get back to you soon.
              </p>

              {/* What's Next Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8 text-left">
                <h2 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">
                  What happens next
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">I typically respond within 24-48 hours</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">You'll receive a response at the email you provided</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-600">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">We can schedule a call if needed to discuss your project</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Return Home
                  </motion.button>
                </Link>

                <Link href="/blog">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Read Blog
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}

