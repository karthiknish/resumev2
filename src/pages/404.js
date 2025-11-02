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
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.2),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(15,118,110,0.18),_transparent_70%)]" />

          <div className="relative flex min-h-screen items-center justify-center px-6 py-24 sm:px-10 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-3xl text-center space-y-8"
            >
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200">
                404
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight text-white">
                The page you’re looking for isn’t here.
              </h1>
              <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
                It may have moved or no longer exists. Let’s get you back to a place where you can keep exploring projects, services, and insights.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
                <Link href="/">
                  <Button className="bg-white text-slate-900 hover:bg-slate-200">
                    Return home
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" className="border-white/20 text-slate-200 hover:bg-white/10">
                    Explore services
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="ghost" className="text-slate-300 hover:bg-white/10">
                    Contact
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
