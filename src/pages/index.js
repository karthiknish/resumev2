import Head from "next/head";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";
import {
  Paintbrush,
  Smartphone,
  GaugeCircle,
  Puzzle,
  Cloud,
  Rocket,
  Compass,
  CircuitBoard,
  Sparkles,
  Code,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import JsonLd, {
  createWebsiteSchema,
  createPersonSchema,
} from "@/components/JsonLd";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiPython,
  SiAmazonaws,
  SiDocker,
  SiMongodb,
  SiStripe,
  SiD3Dotjs,
  SiPostgresql,
  SiFirebase,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";

const technologies = [
  {
    name: "React",
    category: "Frontend",
    icon: SiReact,
    classes: "text-cyan-600 border-cyan-200",
  },
  {
    name: "React Native",
    category: "Mobile",
    icon: TbBrandReactNative,
    classes: "text-purple-600 border-purple-200",
  },
  {
    name: "Next.js",
    category: "Framework",
    icon: SiNextdotjs,
    classes: "text-gray-900 border-gray-300",
  },
  {
    name: "TypeScript",
    category: "Language",
    icon: SiTypescript,
    classes: "text-blue-600 border-blue-200",
  },
  {
    name: "Node.js",
    category: "Backend",
    icon: SiNodedotjs,
    classes: "text-green-600 border-green-200",
  },
  {
    name: "Python",
    category: "Language",
    icon: SiPython,
    classes: "text-yellow-600 border-yellow-200",
  },
  {
    name: "AWS",
    category: "Cloud",
    icon: SiAmazonaws,
    classes: "text-orange-500 border-orange-200",
  },
  {
    name: "Docker",
    category: "DevOps",
    icon: SiDocker,
    classes: "text-cyan-600 border-cyan-200",
  },
];

const capabilities = [
  {
    title: "Beautiful Interfaces",
    description:
      "Crafting pixel‑perfect user experiences users trust and enjoy.",
    icon: Paintbrush,
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
  },
  {
    title: "Cross-Platform Apps",
    description:
      "Building native‑quality mobile apps that work seamlessly across iOS and Android.",
    icon: Smartphone,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    title: "High Performance",
    description:
      "Optimizing applications for speed, efficiency, and scalability.",
    icon: GaugeCircle,
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  },
  {
    title: "Custom Solutions",
    description: "Developing tailored software that fits your business needs.",
    icon: Puzzle,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    title: "Cloud Infrastructure",
    description: "Setting up robust, scalable cloud environments for growth.",
    icon: Cloud,
    color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
  },
  {
    title: "Rapid Development",
    description:
      "Delivering high‑quality products quickly using modern practices.",
    icon: Rocket,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
];

const projects = [
  {
    title: "Healthcare Platform Development",
    description:
      "Built Medblocks, a comprehensive healthcare platform that enables developers to create modern healthcare applications using vendor-neutral APIs. The platform serves as an operating system for healthcare apps, supporting openEHR standards and providing seamless data migration tools. Created both the core platform and Medblocks UI, a web components library that converts openEHR templates into reusable form components.",
    tech: ["React", "Next.js", "TypeScript", "Web Components"],
    impact: "Reduced integration time from months to weeks for healthcare organizations",
  },
  {
    title: "E-commerce Solutions",
    description:
      "Developed complete e-commerce platforms with modern architecture featuring real-time inventory management, secure payment processing, and comprehensive admin dashboards. Built scalable solutions that handle high traffic volumes during peak sales periods while maintaining optimal performance and user experience.",
    tech: ["React", "Node.js", "MongoDB", "Stripe API"],
    impact: "Increased conversion rates by 35% through optimized user flows",
  },
  {
    title: "Data Analytics & Business Intelligence",
    description:
      "Created real-time data visualization platforms with interactive dashboards, custom reporting systems, and advanced filtering capabilities. Built unified data pipelines that provide executive teams with live business insights, enabling data-driven decision making across organizations.",
    tech: ["Next.js", "D3.js", "PostgreSQL", "Python"],
    impact: "Enabled 25% revenue increase through actionable business insights",
  },
  {
    title: "Mobile Application Development",
    description:
      "Developed cross-platform mobile applications with focus on user experience and performance. Built banking applications with biometric authentication, real-time transaction processing, and comprehensive financial management features that meet stringent security requirements.",
    tech: ["React Native", "TypeScript", "AWS", "Firebase"],
    impact: "Delivered secure, scalable mobile solutions for financial services",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    content:
      "Karthik delivered our mobile app ahead of schedule. The quality was exceptional and the user experience is exactly what we envisioned.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    content:
      "Working with Karthik transformed our idea into a production-ready platform. His cross-platform expertise saved us months of development time.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Emma Davis",
    role: "CTO at InnovateLab",
    content:
      "The cloud infrastructure Karthik built for us has been rock-solid. Zero downtime and scales beautifully with our growing user base.",
    rating: 5,
    avatar: "",
  },
];

const stats = [
  {
    value: "4+ years",
    label: "Product engineering experience",
  },
  {
    value: "40+ launches",
    label: "Web & mobile products shipped",
  },
  {
    value: "3 continents",
    label: "Teams partnered with",
  },
];

const services = [
  {
    title: "Product Strategy & Discovery",
    description:
      "Align product direction with market insights, shape research-backed roadmaps, and validate essential hypotheses before writing a single line of code.",
    icon: Compass,
    highlights: [
      "User Research & Personas",
      "Technical Feasibility Audit",
      "MVP Definition & Roadmap",
    ],
  },
  {
    title: "Engineering & Architecture",
    description:
      "Build resilient, scalable applications with modern stacks. I focus on clean code, automated testing, and cloud-native infrastructure to ensure long-term velocity.",
    icon: Code,
    highlights: [
      "React, Next.js, React Native",
      "Node.js & Cloud Infrastructure",
      "API Design & Database Modeling",
    ],
  },
  {
    title: "Growth & Lifecycle",
    description:
      "Instrument analytics, craft activation funnels, and use experimentation to grow adoption. Implement performance budgets and meaningful KPIs baked into the product.",
    icon: ChartBarSquareIcon,
    highlights: [
      "Mixpanel, GA4, Amplitude integrations",
      "Lifecycle automations with messaging flows",
      "Experimentation pipelines, Meta Ads, LinkedIn Ads, Google Ads",
    ],
  },
];

const process = [
  {
    title: "Discover",
    description:
      "Rapid workshops to map goals, users, and technical constraints before writing a single line of code.",
    icon: Compass,
  },
  {
    title: "Design & Build",
    description:
      "Ship user-facing value every week with modern tooling, clean architecture, and measurable quality gates.",
    icon: CircuitBoard,
  },
  {
    title: "Launch & Evolve",
    description:
      "Guide releases, automate operations, and iterate with data so your product keeps compounding value.",
    icon: Sparkles,
  },
];

const techIcons = {
  "React": SiReact,
  "React Native": TbBrandReactNative,
  "Next.js": SiNextdotjs,
  "TypeScript": SiTypescript,
  "Node.js": SiNodedotjs,
  "Python": SiPython,
  "AWS": SiAmazonaws,
  "Docker": SiDocker,
  "MongoDB": SiMongodb,
  "Stripe API": SiStripe,
  "D3.js": SiD3Dotjs,
  "PostgreSQL": SiPostgresql,
  "Firebase": SiFirebase,
  "Web Components": Code,
};

const HomeScreen = () => {
  const websiteSchema = createWebsiteSchema();
  const personSchema = createPersonSchema();

  return (
    <>
      <Head>
        <title>
          Karthik Nishanth - Cross Platform Developer | Liverpool, UK
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Cross platform developer specializing in web and mobile applications. Building modern, scalable solutions with React, React Native, and cloud technologies."
        />
        <meta
          name="keywords"
          content="Cross Platform Developer, Mobile App Development, Web Development, React, React Native, Node.js, TypeScript, Liverpool, UK"
        />
        <meta name="author" content="Karthik Nishanth" />
        <link rel="canonical" href="https://karthiknish.com/" />

        <meta
          property="og:title"
          content="Karthik Nishanth - Cross Platform Developer | Liverpool, UK"
        />
        <meta
          property="og:description"
          content="Cross platform developer creating modern, scalable web and mobile solutions for businesses."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/" />
        <meta property="og:image" content="https://karthiknish.com/Logo.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Karthik Nishanth - Cross Platform Developer"
        />
        <meta
          name="twitter:description"
          content="Cross platform developer creating modern, scalable web and mobile solutions for businesses."
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        <JsonLd data={websiteSchema} />
        <JsonLd data={personSchema} />
      </Head>

      <div className="min-h-screen overflow-x-hidden">
        <section className="relative overflow-hidden text-slate-100">
          <div className="absolute inset-0 -z-30">
            <Image
              src="/hero-back.jpeg"
              alt="Abstract neon glass background"
              fill
              priority
              sizes="100vw"
              className="object-cover darken-[rgba(0,0,0,0.5)] object-center"
            />
          </div>
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950/45 via-slate-950/30 to-slate-900/20" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_62%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.14),_transparent_58%)]" />

          <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 py-28 md:py-32">
            <div className="grid gap-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
              <div className="space-y-10">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-300"
                >
                  Freelance engineering partner
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight"
                >
                  I help founders and teams ship confident, resilient software that feels impeccably crafted.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed"
                >
                  Based in Liverpool, I design, build, and scale web and mobile products with a focus on performance, thoughtful UX, and sustainable engineering practices.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Link href="/contact">
                    <Button className="bg-slate-100 text-slate-900 hover:bg-slate-300">
                      Start a project
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href="#work">
                    <Button variant="outline" className="border-slate-500/70 bg-transparent text-slate-100 hover:bg-slate-800/70 hover:text-white">
                      See recent work
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid gap-6 sm:grid-cols-3 border-t border-slate-800 pt-8"
                >
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-1">
                      <p style={{fontFamily: "Instrument Serif, serif"}} className="font-heading text-2xl text-slate-50">
                        {stat.value}
                      </p>
                      <p className="text-sm text-slate-400 leading-snug">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <Card className="border-slate-800 bg-slate-900/60 backdrop-blur">
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-3">
                      <p className="text-xs uppercase text-slate-400 tracking-[0.3em]">
                        Core stack
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {technologies.map((tech) => {
                          const Icon = tech.icon;
                          return (
                            <span
                              key={tech.name}
                              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-200"
                            >
                              <Icon className="h-4 w-4" />
                              {tech.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs uppercase text-slate-400 tracking-[0.3em]">
                        What clients notice
                      </p>
                      <ul className="space-y-2 text-sm text-slate-300">
                        <li>• Pragmatic delivery with enterprise-grade tooling.</li>
                        <li>• UI polish that reflects your brand from day one.</li>
                        <li>• Clear communication, async-friendly collaboration.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,3.2fr)] items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8 lg:sticky lg:top-32"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase text-slate-500 tracking-[0.3em]">
                    Capability
                  </p>
                  <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900">
                    Scale ideas into production-grade products without sacrificing craft.
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    I work end-to-end across discovery, product design, and engineering. Whether you need a new build or help levelling up an existing platform, we create a roadmap, move fast, and keep quality measurable.
                  </p>
                </div>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2">
                {capabilities.map((capability, index) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className={`mb-6 inline-flex items-center justify-center rounded-xl p-3 border transition-colors ${capability.color}`}>
                      <capability.icon className="h-6 w-6 text-slate-700" />
                    </div>
                    <h3 className="font-heading text-xl text-slate-900 mb-3">
                      {capability.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {capability.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-slate-50" id="work">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="max-w-2xl mb-20 md:mb-28">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xs uppercase text-slate-500 tracking-[0.3em]"
              >
                Selected Work
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900 mt-4"
              >
                Recent projects where technical expertise meets business impact.
              </motion.h2>
            </div>

            <div className="space-y-32">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="group relative grid gap-8 md:grid-cols-[1fr_1.5fr] lg:gap-20"
                >
                  {/* Decorative Number */}
                  <div className="absolute -left-4 -top-20 -z-10 select-none text-[8rem] sm:text-[10rem] font-bold leading-none text-slate-100/80 md:-left-12 md:-top-24">
                    0{index + 1}
                  </div>

                  <div className="space-y-8 pt-4">
                    <h3 className="font-heading text-3xl sm:text-4xl text-slate-900 leading-tight">
                      {project.title}
                    </h3>
                    
                   
                  </div>

                  <div className="space-y-8">
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {project.description}
                    </p>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-100/50 p-5 border border-slate-200">
                            <div className="flex items-center gap-2 mb-3 text-slate-900">
                                <TrendingUp className="h-5 w-5" />
                                <span className="font-bold text-sm uppercase tracking-wider">Impact</span>
                            </div>
                            <p className="text-slate-700 font-medium leading-relaxed">
                                {project.impact}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech) => {
                                  const Icon = techIcons[tech] || Code;
                                  return (
                                    <span
                                        key={tech}
                                        className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm text-slate-600 border border-slate-200 shadow-sm"
                                    >
                                        <Icon className={`h-4 w-4 ${tech === "Next.js" ? "text-slate-800" : "text-slate-500"}`} />
                                        {tech}
                                    </span>
                                  );
                                })}
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-slate-950 text-slate-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <p className="text-xs uppercase text-slate-300 tracking-[0.3em]">
                  Services
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-white">
                  Engagement formats designed to meet teams where they are.
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  From product discovery to growth infrastructure, each engagement pairs senior hands-on execution with clear operating rhythms and measurable outcomes.
                </p>
              </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col h-full rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-slate-100 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 font-heading text-2xl text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed flex-grow">
                    {service.description}
                  </p>
                  {service.highlights?.length ? (
                    <ul className="mt-5 space-y-2 text-sm text-slate-300 pt-4 border-t border-white/10">
                      {service.highlights.map((highlight) => (
                        <li key={highlight}>• {highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background relative">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="mb-20 md:text-center max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <p className="text-xs uppercase text-slate-500 tracking-[0.3em]">
                  Process
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl text-slate-900 leading-snug">
                  A calm, outcome-led way to build software.
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  Engagements are structured, transparent, and async-friendly. We align on success metrics early, then iterate with a shared roadmap and frequent demos so you can see progress without micromanaging.
                </p>
              </motion.div>
            </div>

            <div className="relative grid gap-12 md:gap-8 md:grid-cols-3">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 -z-10" />
              
              {process.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="mb-6 relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm z-10 relative group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="h-7 w-7 text-slate-700" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                      0{index + 1}
                    </div>
                  </div>
                  
                  <h3 className="font-heading text-2xl text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-slate-950 text-slate-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase text-slate-400 tracking-[0.3em]"
            >
              Testimonials
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading text-3xl sm:text-4xl leading-snug text-slate-50 mt-4 mb-12"
            >
              Product leaders partner with me when reliability, momentum, and polish matter.
            </motion.h2>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur"
                >
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    “{testimonial.content}”
                  </p>
                  <div>
                    <p className="text-base text-slate-50 font-medium">
                      {testimonial.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">
                      {testimonial.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 -z-30">
            <Image
              src="/hero-back.jpeg"
              alt="Abstract neon glass background"
              fill
              sizes="100vw"
              className="object-cover darken-[rgba(0,0,0,0.55)] object-center"
            />
          </div>
          <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-950/70 via-slate-950/60 to-slate-900/40" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_62%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.14),_transparent_58%)]" />

          <div className="relative max-w-5xl mx-auto px-6 sm:px-10 md:px-12 text-center text-slate-100">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-heading text-3xl sm:text-4xl leading-snug"
            >
              Let’s design the next chapter of your product.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-base text-slate-300 leading-relaxed max-w-2xl mx-auto"
            >
              Share the roadmap, the constraints, or even the chaos you’re working within. I’ll help uncover the best path forward and start shipping.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/contact">
                <Button className="bg-slate-100 text-slate-900 hover:bg-slate-300">
                  Book a call
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" className="border-white/50 bg-transparent text-slate-100 hover:bg-white/10 hover:text-white">
                  Explore services
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeScreen;