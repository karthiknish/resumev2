import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { FadeIn, SlideInRight } from "@/components/animations/MotionComponents";
import { Home, Compass, MessageCircle } from "lucide-react";

const FourOhFour: React.FC = () => {
  return (
    <>
      <Head>
        <title>404: Page Not Found | Karthik Nishanth</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist or has been moved."
        />
      </Head>
      <PageContainer>
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-30">
            <Image
              src="/hero-back.jpeg"
              alt="Background"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-20 bg-slate-950/70" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.15),_transparent_60%)]" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <FadeIn>
              <div className="mb-8">
                <motion.span 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="inline-flex items-center px-6 py-2 rounded-full border border-white/20 bg-white/10 text-blue-400 font-mono text-xl md:text-2xl backdrop-blur-md"
                >
                  404 ERROR
                </motion.span>
              </div>

              <h1 className="font-heading text-5xl md:text-8xl text-white mb-8 leading-tight">
                Looks like you're <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">lost.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for has either drifted into the void or never existed. Let's get you back on track.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/">
                  <Button className="h-14 px-8 bg-white text-slate-900 hover:bg-slate-200 rounded-2xl font-bold text-lg group">
                    <Home className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                    Return home
                  </Button>
                </Link>
                
                <Link href="/services">
                  <Button variant="outline" className="h-14 px-8 border-white/30 bg-white/10 text-white hover:bg-white/20 rounded-2xl font-bold text-lg group">
                    <Compass className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                    Our services
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button variant="ghost" className="h-14 px-8 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl font-bold text-lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Get in touch
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Decorative floating elements */}
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" />
        </div>
      </PageContainer>
    </>
  );
};

export default FourOhFour;
