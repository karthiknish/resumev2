import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Activity, Shield, Stethoscope, Sparkles, Smartphone, Pill, Zap, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const project = {
  id: "healthcare-marketplace",
  title: "Healthcare Marketplace",
  meta: "Digital Medical Procurement",
  description: "A specialized B2B marketplace platform for healthcare providers and medical equipment suppliers, streamlining the procurement of critical surgical and clinical supplies.",
  longDescription: "The Healthcare Marketplace was designed to solve the transparency and efficiency challenges in medical supply procurement. We built a robust mobile platform that connects hospitals and clinics directly with verified manufacturers. By implementing real-time inventory tracking, transparent pricing, and a secure ordering workflow, we've helped healthcare facilities reduce procurement overhead and ensure the availability of essential medical items.",
  icon: <Stethoscope className="w-8 h-8 text-blue-500" />,
  status: "Completed",
  tags: [
    "React Native",
    "Node.js",
    "PostgreSQL",
    "Inventory Management",
    "B2B Marketplace",
    "Supply Chain Optimization",
    "Fintech Integration"
  ],
  images: [
    "/medical/original-90f301b93e7e7f91676154a0ee74d3e4.webp",
    "/medical/original-0bbd7864b3bc33063ada82d646fffbb7.webp",
    "/medical/original-c219d3c6c497cb3090877c915c0e92c4.webp"
  ]
};

export default function MedicalProject() {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <>
      <Head>
        <title>{project.title} - Healthcare Procurement Case Study</title>
        <meta name="description" content={project.description} />
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-slate-50 py-24 md:py-32 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2" />

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
                       <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1 font-bold">
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
                          currentImage === i ? "w-8 bg-blue-500" : "bg-white/50 backdrop-blur-sm"
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
                      <Activity className="text-blue-500" />
                      The Challenge
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-6">
                      "Medical procurement is often opaque, plagued by inconsistent pricing and unpredictable lead times that can impact patient care."
                    </p>
                    <p className="text-lg text-slate-600 leading-relaxed mt-6">
                      Hospitals were dealing with complex vendor relationships, manual order tracking, and frequent stockouts of critical clinical supplies. The fragmentation of the market made it difficult for administrators to optimize costs and for suppliers to reach a wider base of healthcare providers effectively.
                    </p>
                  </section>

                  <section>
                    <h2 className="font-heading text-3xl text-slate-900 mb-6 flex items-center gap-3">
                      <Sparkles className="text-emerald-500" />
                      The Solution
                    </h2>
                    <ul className="space-y-6">
                      {[
                        { title: "Unified Catalog", desc: "A centralized digital catalog featuring thousands of medical products with detailed specs and images." },
                        { title: "Transparent Pricing", desc: "Dynamic pricing models with bulk order discounts and clear cost breakdowns." },
                        { title: "Secure Order Flow", desc: "End-to-end encrypted order placement with digital sign-offs and status tracking." }
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
                    <h3 className="font-bold text-slate-900 mb-4 block">Core Features Built</h3>
                    <ul className="space-y-3">
                      {[
                        "Vendor Verification System",
                        "Real-time Inventory Sync",
                        "Automated Invoicing",
                        "Supplier Performance Dashboard",
                        "Multi-level Approval Workflow"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-32 p-12 md:p-16 rounded-[3rem] bg-blue-900 text-white text-center">
                <h3 className="font-heading text-3xl md:text-5xl mb-8">Building the future of HealthTech</h3>
                <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
                   I help healthcare startups and enterprises build secure, scalable solutions that solve real-world clinical problems.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link href="/contact" className="px-8 py-4 bg-white text-blue-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-colors">
                    Discuss your project
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
