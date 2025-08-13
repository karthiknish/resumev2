import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";

export default function Unauthorized() {
  return (
    <>
      <Head>
        <title>Unauthorized Access - Karthik Nishanth</title>
        <meta
          name="description"
          content="You don't have permission to access this page."
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800"
              >
                <span className="text-4xl">🔐</span>
              </motion.div>

              <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Unauthorized Access
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                You don't have permission to view this page.
              </p>

              <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-left space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-xl">⚠️</span>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">
                      This page requires administrator privileges.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-xl">👤</span>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">
                      Please ensure you are logged in with the correct account.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-xl">📧</span>
                    </div>
                    <p className="ml-3 text-gray-700 dark:text-gray-300">
                      If you believe this is an error, please contact support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <span>🏠</span>
                    Go Home
                  </motion.button>
                </Link>

                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <span>📧</span>
                    Contact Support
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}