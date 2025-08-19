import React from "react";
import Link from "next/link";
import Head from "next/head";
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
      </Head>
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center py-16 px-6">
          <div className="w-full max-w-2xl text-center">
            <div className="text-7xl md:text-8xl font-extrabold text-gray-900 dark:text-white">
              404
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Page not found
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-400">
              The page you’re looking for doesn’t exist or may have been moved.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <button className="px-6 py-3 rounded-xl font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:opacity-90 transition">
                  Go home
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-6 py-3 rounded-xl font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Contact
                </button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
