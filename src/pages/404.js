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
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto relative">
          <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />

          <FadeIn>
            <div className="text-center mb-10">
              <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                404 Error
              </h1>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 max-w-2xl mx-auto text-center">
              <p className="text-gray-300 text-lg mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
              >
                Return to Homepage →
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}
