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
    title: "E-commerce Platform",
    description:
      "A complete e-commerce solution built with React and Node.js, featuring real-time inventory, payment processing, and admin dashboard.",
    image: "/netflix.png",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "/projects/ecommerce-solutions",
    color: "bg-gradient-to-br from-purple-50 to-pink-50",
  },
  {
    title: "Banking Mobile App",
    description:
      "Cross-platform mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management.",
    image: "/credcard.png",
    tech: ["React Native", "TypeScript", "AWS", "Firebase"],
    link: "/projects/mobile-app-development",
    color: "bg-gradient-to-br from-blue-50 to-cyan-50",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Real-time data visualization platform with interactive charts, custom reporting, and advanced filtering capabilities.",
    image: "/medblocks.png",
    tech: ["Next.js", "D3.js", "PostgreSQL", "Redis"],
    link: "/projects/analytics-system",
    color: "bg-gradient-to-br from-green-50 to-emerald-50",
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
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
                      <p className="font-heading text-2xl text-slate-50">
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
            <div className="grid gap-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <p className="text-xs uppercase text-slate-500 tracking-[0.3em]">
                  Capability
                </p>
                <h2 className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900">
                  Scale ideas into production-grade products without sacrificing craft.
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  I work end-to-end across discovery, product design, and engineering. Whether you need a new build or help levelling up an existing platform, we create a roadmap, move fast, and keep quality measurable.
                </p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2">
                {capabilities.map((capability) => (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-slate-100 p-2">
                      <capability.icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <h3 className="font-heading text-xl text-slate-900 mb-2">
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
            <div className="max-w-2xl mb-12">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xs uppercase text-slate-500 tracking-[0.3em]"
              >
                Case studies
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-3xl sm:text-4xl leading-snug text-slate-900"
              >
                Recent work where design systems, code quality, and business outcomes align.
              </motion.h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <Link href={project.link}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="font-heading text-2xl text-slate-900">
                        {project.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-16 flex justify-end">
              <Link href="/projects">
                <Button variant="outline" className="border-slate-400 text-slate-700 hover:bg-slate-100">
                  View all projects
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-slate-950 text-slate-100">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,2.8fr)] items-start">
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

              <div className="space-y-6">
                {services.map((service) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-slate-100">
                      <service.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 font-heading text-2xl text-white">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                      {service.description}
                    </p>
                    {service.highlights?.length ? (
                      <ul className="mt-5 space-y-2 text-sm text-slate-300">
                        {service.highlights.map((highlight) => (
                          <li key={highlight}>• {highlight}</li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
            <div className="grid gap-12 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2.8fr)] items-start">
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

              <div className="space-y-6">
                {process.map((step) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-2">
                      <h3 className="font-heading text-xl text-slate-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
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