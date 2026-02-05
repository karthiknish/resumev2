import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Zap, Shield, Sparkles, Smartphone, CheckCircle2, ChevronLeft, ChevronRight, Clock, Target, Layers } from "lucide-react";
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { FadeIn, SlideInRight } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const project = {
  id: "daily-productivity",
  title: "Daily Productivity",
  meta: "Hyper-Focused Task Management",
  description: "A high-performance task management app focused on deep work, minimal distractions, and intuitive gesture-based navigation for power users.",
  longDescription: "Daily Productivity was designed for professionals who find traditional task managers too cluttered. We focused on a 'one task at a time' philosophy, implementing a high-fidelity interface that suppresses distractions and rewards deep work cycles. By combining elegant gesture-based controls with powerful time-blocking features, we created a tool that helps users reclaim their focus and ship their best work.",
  icon: <Clock className="w-8 h-8 text-amber-500" />,
  status: "Completed",
  tags: [
    "SwiftUI",
    "Combine",
    "Core Data",
    "Haptic Feedback",
    "Gesture UX",
    "iOS Native",
    "Local-First"
  ],
  images: [
    "/daily/original-0152858b35c0485b5d1b42c25031d1ce.webp",
    "/daily/original-26b7a483b2826430d03b141d051eddc3.webp"
  ]
};

export default function DailyProductivityProject() {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <>
      <Head>
        <title>{project.title} - Productivity App Case Study</title>
        <meta name="description" content={project.description} />
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-slate-50 py-24 md:py-32 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2" />

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
                       <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100 px-3 py-1 font-bold">
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
                          currentImage === i ? "w-8 bg-amber-500" : "bg-white/50 backdrop-blur-sm"
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
                      <Target className="text-amber-500" />
                      The Challenge
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-6">
                      "Traditional task managers often become just another source of stress. We wanted to build something that feels like a calm, focused workspace."
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed mt-6">
                      Most productivity tools suffer from 'feature creep,' overwhelming users with tabs, folders, and tags. The challenge was to strip away the noise while maintaining the power needed for serious professional workflows.
                    </p>
                  </section>

                  <section>
                    <h2 className="font-heading text-3xl text-slate-900 mb-6 flex items-center gap-3">
                      <Layers className="text-slate-500" />
                      The Solution
                    </h2>
                    <ul className="space-y-6">
                      {[
                        { title: "Deep Work Mode", desc: "A dedicated interface that hides all non-essential tasks during active work sessions." },
                        { title: "Gesture-First UX", desc: "Natural swiping and pinching gestures to manage tasks without looking for buttons." },
                        { title: "Smart Time-Blocking", desc: "Intelligent scheduling that maps tasks directly to your calendar availability." }
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

                  <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 block">Key Innovations</h3>
                    <ul className="space-y-3">
                      {[
                        "Zero-Latency State Sync",
                        "Custom Haptic Feedback Library",
                        "Intelligent Batch Processing",
                        "Focus Session Analytics",
                        "Accessibility-First Design"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-32 p-12 md:p-16 rounded-[3rem] bg-amber-900 text-white text-center">
                <h3 className="font-heading text-3xl md:text-5xl mb-8">Ready to reclaim your focus?</h3>
                <p className="text-xl text-amber-200 mb-10 max-w-2xl mx-auto">
                   I build tools that help teams and individuals produce their best work through thoughtful engineering and design.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/contact" className="px-8 py-4 bg-white text-amber-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-colors">
                    Start a project
                  </Link>
                  <Link href="/services/mobile-app-development" className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-colors">
                    Back to services
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
