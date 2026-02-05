import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Heart, Shield, Sparkles, Smartphone, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { FadeIn, SlideInRight } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const project = {
  id: "matrimony-platform",
  title: "Matrimony Platform",
  meta: "Community-First Matchmaking",
  description: "A secure, community-focused mobile platform designed to modernize the traditional matchmaking experience with real-time engagement and verified profiles.",
  longDescription: "The Matrimony Platform was born out of a need to bridge the gap between traditional community values and modern digital convenience. We built a cross-platform mobile application that prioritizes user safety, cultural nuances, and high-signal matching. By implementing a multi-step verification process and real-time communication features, we transformed a historically fragmented process into a seamless, trustworthy experience for thousands of users.",
  icon: <Heart className="w-8 h-8 text-rose-500" />,
  status: "Completed",
  tags: [
    "React Native",
    "Firebase",
    "Real-time Chat",
    "Identity Verification",
    "UX Design",
    "Community Building",
    "Mobile Strategy"
  ],
  images: [
    "/matrimony/original-691f91bbbbd44b2f626851d77dedbd22.webp",
    "/matrimony/original-818f16c5c9b3bfd92130c7d9cd19950f.webp",
    "/matrimony/original-a4b032e27b110dc920a29aee58f57948.webp"
  ]
};

export default function MatrimonyProject() {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <>
      <Head>
        <title>{project.title} - Modern Matchmaking Case Study</title>
        <meta name="description" content={project.description} />
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-slate-50 py-24 md:py-32 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2" />

          <div className="max-w-5xl mx-auto px-6 relative z-10">
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-12"
            >
              <Link href="/services/mobile-app-development" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors">
                <motion.svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </motion.svg>
                Back to Mobile Services
              </Link>
            </motion.div>

            <article>
              {/* Header */}
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center">
                    {project.icon}
                  </div>
                  <div>
                    <h1 className="font-heading text-4xl md:text-6xl text-slate-900 leading-tight">
                      {project.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-3 py-1 font-bold">
                        {project.status}
                      </Badge>
                      <span className="text-slate-500 font-medium">{project.meta}</span>
                    </div>
                  </div>
                </div>
                <p className="text-2xl text-slate-600 leading-relaxed max-w-3xl">
                  {project.longDescription}
                </p>
              </div>

              {/* Image Showcase - Carousel */}
              <div className="relative group mb-24">
                <div className="overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white bg-white aspect-video relative">
                  <motion.div 
                    className="flex h-full"
                    animate={{ x: `-${currentImage * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {project.images.map((img, idx) => (
                      <div key={idx} className="relative min-w-full h-full">
                        <Image 
                          src={img} 
                          alt={`${project.title} screenshot ${idx + 1}`} 
                          fill 
                          className="object-contain p-4 transition-transform duration-700 hover:scale-105"
                          priority={idx === 0}
                        />
                      </div>
                    ))}
                  </motion.div>

                  {/* Navigation Arrows */}
                  <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
                    <button 
                      onClick={() => setCurrentImage((prev: number) => (prev > 0 ? prev - 1 : project.images.length - 1))}
                      className="p-3 rounded-full bg-white/95 shadow-xl text-slate-800 pointer-events-auto hover:bg-white transition-all active:scale-95 disabled:opacity-50"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setCurrentImage((prev: number) => (prev < project.images.length - 1 ? prev + 1 : 0))}
                      className="p-3 rounded-full bg-white/95 shadow-xl text-slate-800 pointer-events-auto hover:bg-white transition-all active:scale-95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Indicators */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {project.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentImage === i ? "w-8 bg-rose-500" : "bg-white/50 backdrop-blur-sm"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-20" />

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-16">
                {/* Left Column: Story */}
                <div className="space-y-12">
                  <section>
                    <h2 className="font-heading text-3xl text-slate-900 mb-6 flex items-center gap-3">
                      <Shield className="text-blue-500" />
                      The Challenge
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-6">
                      "How do we build a platform that feels modern enough for young professionals, yet secure enough to satisfy the most cautious parents?"
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed mt-6">
                      Establishing trust in a digital matchmaking environment is notoriously difficult. We needed to solve for authenticated profiles, prevent harassment, and maintain high engagement in a community where privacy is paramount.
                    </p>
                  </section>

                  <section>
                    <h2 className="font-heading text-3xl text-slate-900 mb-6 flex items-center gap-3">
                      <Sparkles className="text-amber-500" />
                      The Solution
                    </h2>
                    <ul className="space-y-6">
                      {[
                        { title: "Verified Identity", desc: "Implemented a multi-factor verification system including ID checks and mobile number binding." },
                        { title: "Smart Chat Filters", desc: "Automated moderation to ensure respectful communication and prevent data leakage." },
                        { title: "Preference Matching", desc: "A hybrid algo-manual matching system that respects both data and personal choice." }
                      ].map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                          <div>
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <p className="text-slate-600">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* Right Column: Details & Tech */}
                <div className="space-y-12">
                  <section>
                    <h2 className="font-heading text-2xl text-slate-900 mb-6">Technical Stack</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} className="bg-slate-900 text-white px-4 py-2 text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-32 p-12 md:p-16 rounded-[3rem] bg-slate-900 text-white text-center">
                <h3 className="font-heading text-3xl md:text-5xl mb-8">Want to build something similar?</h3>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                   I help founders turn complex community needs into high-performance mobile experiences.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/contact" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-colors">
                    Start a consultation
                  </Link>
                  <Link href="/services" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors">
                    Explore services
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
