import React from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>404 Not Found - Karthik Nishanth | Cross-Platform Developer</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist or has been moved."
        />
      </Head>
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-24 sm:px-10 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl text-center space-y-6"
          >
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-slate-500">
              404
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight text-slate-900">
              The page you’re looking for isn’t here.
            </h1>
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
              It may have moved or no longer exists. Let’s get you back to a place where you can keep exploring projects, services, and insights.
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/">
                <Button className="w-full sm:w-auto rounded-xl">
                  Return home
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl text-slate-600 border-slate-200 hover:bg-slate-200/60"
                >
                  Explore services
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="ghost"
                  className="w-full sm:w-auto rounded-xl text-slate-500 hover:bg-slate-200/50"
                >
                  Contact
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
