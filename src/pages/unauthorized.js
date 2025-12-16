import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { Lock } from "lucide-react";

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
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-50 border border-red-100 mb-6"
              >
                <Lock className="w-10 h-10 text-red-500" />
              </motion.div>

              <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
                Unauthorized Access
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                You don't have permission to view this page.
              </p>

              <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-left">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    </div>
                    <p className="text-slate-600 font-medium">
                      This page requires administrator privileges.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    </div>
                    <p className="text-slate-600 font-medium">
                      Please ensure you are logged in with the correct account.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    </div>
                    <p className="text-slate-600 font-medium">
                      If you believe this is an error, please contact support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    Go Home
                  </motion.button>
                </Link>

                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md"
                  >
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
