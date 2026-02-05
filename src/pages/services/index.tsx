import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  FaPaintBrush, 
  FaGlobe, 
  FaStore, 
  FaCode, 
  FaServer, 
  FaMobileAlt, 
  FaRocket, 
  FaDatabase, 
  FaLightbulb 
} from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn, SlideInRight } from "@/components/animations/MotionComponents";

const services = [
  {
    title: "Website Reskin",
    slug: "website-reskin",
    description: "Give your existing website a calm, modern facelift while keeping foundations that already work.",
    icon: <FaPaintBrush className="w-6 h-6" />,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Brochure Websites",
    slug: "brochure-websites",
    description: "Launch a trusted presence that explains who you are, what you do and why people should work with you.",
    icon: <FaGlobe className="w-6 h-6" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    title: "E-commerce Solutions",
    slug: "ecommerce-solutions",
    description: "Build a resilient storefront with payments, fulfilment and analytics baked in from day one.",
    icon: <FaStore className="w-6 h-6" />,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Frontend Development",
    slug: "frontend-development",
    description: "Pixel-perfect interfaces built with React and Next.js, focused on performance and accessibility.",
    icon: <FaCode className="w-6 h-6" />,
    color: "text-cyan-600",
    bg: "bg-cyan-50"
  },
  {
    title: "Backend Development",
    slug: "backend-development",
    description: "Scalable backend systems engineered for reliability, security, and developer happiness.",
    icon: <FaServer className="w-6 h-6" />,
    color: "text-slate-600",
    bg: "bg-slate-50"
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description: "Cross-platform mobile apps for iOS and Android using React Native, focused on native performance.",
    icon: <FaMobileAlt className="w-6 h-6" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    title: "Performance Optimization",
    slug: "performance-optimization",
    description: "Speed up your web applications to improve search rankings and user retention rates.",
    icon: <FaRocket className="w-6 h-6" />,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    title: "Database Design",
    slug: "database-design",
    description: "Robust data models and architecture designed for scalability and data integrity.",
    icon: <FaDatabase className="w-6 h-6" />,
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    title: "Technical Consultation",
    slug: "technical-consultation",
    description: "Strategic advice on tech stack selection, architecture, and engineering management.",
    icon: <FaLightbulb className="w-6 h-6" />,
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
];

export default function ServicesIndex() {
  return (
    <>
      <Head>
        <title>Services - Professional Web & Mobile Development | Karthik Nishanth</title>
        <meta name="description" content="Explore my comprehensive web and mobile development services. Specializing in Next.js, React Native, and scalable cloud architectures." />
        <meta name="keywords" content="web development, mobile apps, React, Next.js, React Native, backend development, performance optimization, technical consultation" />
        <link rel="canonical" href="https://karthiknish.com/services" />
      </Head>

      <PageContainer>
        <div className="min-h-screen">
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-30">
              <Image
                src="/hero-back.jpeg"
                alt="Abstract glass background"
                fill
                priority
                sizes="100vw"
                className="object-cover darken-[rgba(0,0,0,0.5)] object-center"
              />
            </div>
            <div className="absolute inset-0 -z-20 bg-white/90 backdrop-blur-md" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),_transparent_60%)]" />

            <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 pt-36 pb-16 md:pt-44 md:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-semibold mb-8 shadow-sm">
                  <span>Service Offerings</span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight text-slate-900 mb-8">
                  Technical expertise shaped around <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">business impact</span>
                </h1>

                <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
                  I partner with founders and technical teams to design, build, and scale products that create lasting value. From rapid MVPs to hardening enterprise platforms.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-20 md:py-28 bg-background">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link href={`/services/${service.slug}`} className="group block h-full">
                      <div className="h-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300">
                        <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 ${service.bg} ${service.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                          {service.icon}
                        </div>
                        
                        <h3 className="font-heading text-2xl text-slate-900 mb-4 transition-colors group-hover:text-blue-600">
                          {service.title}
                        </h3>
                        
                        <p className="text-slate-600 text-base leading-relaxed mb-8 flex-grow">
                          {service.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                          Explore service
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-blue-600"
                          >
                            →
                          </motion.span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-slate-950 text-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08),_transparent_70%)]" />
            
            <div className="relative max-w-4xl mx-auto px-6 text-center">
              <FadeIn>
                <h2 className="font-heading text-3xl md:text-5xl text-white mb-8">
                  Not sure which service fits your project?
                </h2>
                <p className="text-lg text-slate-300 mb-12 leading-relaxed">
                  Every product is unique. Let's discuss your current challenges and goals to find the best technical path forward.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/contact">
                    <button style={{color:"black"}} className="px-10 py-5 bg-white text-black rounded-2xl font-bold text-lg shadow-lg hover:shadow-white/10 hover:-translate-y-1 transition-all">
                      Schedule a consultation
                    </button>
                  </Link>
                  <Link href="/about">
                    <button className="px-10 py-5 bg-transparent border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/5 transition-all">
                      About my approach
                    </button>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
