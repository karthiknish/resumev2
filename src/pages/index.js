import Head from "next/head";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/outline";
import {
  PiggyBank,
  Zap,
  Handshake,
  Paintbrush,
  Smartphone,
  GaugeCircle,
  Puzzle,
  Cloud,
  Rocket,
  MonitorSmartphone,
  Layers,
  AppWindow,
  SmartphoneNfc,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const heroStats = [
  {
    value: "8+",
    label: "Years delivering cross-platform products",
  },
  {
    value: "24",
    label: "Apps launched across web, iOS & Android",
  },
  {
    value: "5.0",
    label: "Client rating",
    icon: StarIcon,
  },
];

const crossPlatformSkills = [
  {
    title: "Multi-device product strategy",
    description:
      "Translate product requirements into experiences that feel at home on web, iOS, and Android while sharing the same core architecture.",
    icon: MonitorSmartphone,
    accent: "from-sky-100/80 via-blue-50 to-indigo-100/60",
  },
  {
    title: "Unified codebases",
    description:
      "Leverage React Native, Expo, and Next.js to reuse components and business logic while respecting platform-specific patterns.",
    icon: Layers,
    accent: "from-violet-100/80 via-purple-50 to-pink-100/60",
  },
  {
    title: "Design systems & accessibility",
    description:
      "Establish responsive design systems, typography scales, and accessibility checks that adapt across screen sizes and platforms.",
    icon: AppWindow,
    accent: "from-teal-100/80 via-cyan-50 to-emerald-100/60",
  },
  {
    title: "Native feature integration",
    description:
      "Ship biometric auth, in-app payments, push notifications, and device sensors through modular native bridges.",
    icon: SmartphoneNfc,
    accent: "from-amber-100/80 via-orange-50 to-yellow-100/60",
  },
  {
    title: "Performance engineering",
    description:
      "Profile rendering, memory, and network usage to deliver 60fps experiences and smooth app store reviews.",
    icon: Cpu,
    accent: "from-emerald-100/70 via-green-50 to-lime-100/60",
  },
  {
    title: "Automated & secure delivery",
    description:
      "Automate releases with CI/CD, OTA updates, and cloud security practices that keep deployments reliable.",
    icon: ShieldCheck,
    accent: "from-slate-100/80 via-slate-50 to-gray-100/60",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <JsonLd data={websiteSchema} />
        <JsonLd data={personSchema} />
      </Head>

      <div
        className="min-h-screen bg-background overflow-x-hidden"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Hero Section with stronger theme splash background */}
        <section className="relative py-28 min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-brandSecondary/20 to-accent/25">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 relative z-10 text-center">
            {/* Animated Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full text-foreground/80 text-sm font-semibold mb-8 shadow"
            >
              <span>Hey, I'm Karthik</span>
              <Badge className="bg-secondary text-brandSecondary border-brandSecondary text-xs sm:text-sm">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Open to new cross-platform projects
              </Badge>
            </motion.div>

            {/* Main Headline with Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <span className="text-foreground">Cross Platform</span>
              <br />
              <span className="text-foreground">Developer</span>
              {/* Accent emoji removed */}
            </motion.h1>

            {/* Dynamic Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/70 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              I craft cross-platform products that feel native on every device,
              blending React Native, Next.js, and cloud-first architecture.
            </motion.p>

            {/* Fun tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-gray-600 mb-12 flex items-center justify-center gap-3"
            >
              <span>From UX to app store launch, I handle the full cross-platform lifecycle.</span>
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            >
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl shadow"
                >
                  Start a project
                  <ArrowRightIcon className="ml-3 h-6 w-6" />
                </Button>
              </Link>

              <Link href="#work">
                <Button
                  size="lg"
                  className="bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300"
                >
                  View my work
                </Button>
              </Link>
            </motion.div>

            {/* Hero highlight metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16"
            >
              {heroStats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="group relative overflow-hidden rounded-3xl border border-border/60 bg-white/80 backdrop-blur shadow-lg p-6 sm:p-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-primary/10 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-between gap-3">
                      <div className="text-left">
                        <p
                          className="text-4xl sm:text-5xl font-black text-foreground mb-2"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-sm sm:text-base text-foreground/70 font-medium">
                          {stat.label}
                        </p>
                      </div>
                      {StatIcon && (
                        <span className="flex shrink-0 items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                          <StatIcon className="h-6 w-6" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Enhanced Technology Showcase (icons with tooltip) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-center"
            >
              <p className="text-gray-600 text-lg mb-6 font-medium">
                Core technologies
              </p>
              <div className="flex flex-wrap justify-center gap-5 max-w-5xl mx-auto">
                {technologies.map((tech, index) => {
                  const Icon = tech.icon;
                  return (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                      whileHover={{ y: -6 }}
                      className="relative group"
                    >
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border ${tech.classes} flex items-center justify-center shadow hover:shadow-md transition-all`}
                        aria-label={tech.name}
                      >
                        <Icon
                          className={`w-8 h-8 sm:w-10 sm:h-10 ${
                            tech.classes.split(" ")[0]
                          }`}
                        />
                      </div>
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-gray-900 text-white text-xs px-3 py-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                        {tech.name} · {tech.category}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Scroll indicator removed for a professional layout */}
          </div>
        </section>

        {/* Cross-platform skill set */}
        <section
          id="skills"
          className="relative py-20 md:py-32 bg-gradient-to-br from-background via-secondary/10 to-primary/5 overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-[-6rem] h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 via-brandSecondary/20 to-accent/20 blur-3xl opacity-70" />
            <div className="absolute -bottom-20 left-[-4rem] h-64 w-64 rounded-full bg-gradient-to-tr from-blue-300/20 via-brandSecondary/10 to-primary/20 blur-3xl opacity-70" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge className="mx-auto mb-6 bg-blue-100 text-blue-800 border border-blue-200 shadow-sm">
                Cross-platform skill set
              </Badge>
              <h2
                className="text-5xl md:text-6xl font-black text-foreground mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Expertise built for every screen
              </h2>
              <p className="text-xl sm:text-2xl text-foreground/70 leading-relaxed">
                A proven cross-platform toolkit that blends design systems,
                native capability, and reliable delivery pipelines.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {crossPlatformSkills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.div
                    key={skill.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="group relative h-full overflow-hidden border border-border/60 bg-white/80 backdrop-blur rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${skill.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      />
                      <CardContent className="relative p-8 flex flex-col gap-4">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </span>
                        <CardTitle
                          className="text-2xl font-bold text-foreground"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {skill.title}
                        </CardTitle>
                        <CardDescription className="text-base text-foreground/70 leading-relaxed">
                          {skill.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-brandSecondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent mb-6 text-center"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  What I deliver
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  From discovery to launch — I build cross-platform products
                  that stay fast and dependable.
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card
                    className={`h-full p-10 border-0 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 group rounded-3xl bg-gradient-to-br from-white via-background to-primary/10`}
                  >
                    <div className="flex items-center mb-6">
                      {capability.icon && (
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mr-4">
                          <capability.icon className="w-7 h-7 text-primary" />
                        </span>
                      )}
                      <h3
                        className="text-2xl font-bold text-gray-900"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {capability.title}
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {capability.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section id="work" className="py-20 md:py-32 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent mb-6 text-center"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Featured work
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Recent projects demonstrating modern development and
                  performance.
                </p>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, scale: 1.03 }}
                >
                  <Link href={project.link}>
                    <Card className="h-full overflow-hidden border-2 border-border bg-card shadow hover:shadow-md transition-all duration-300 group cursor-pointer rounded-3xl">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-8">
                        <h3
                          className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-brandSecondary transition-colors"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {project.title}
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {project.tech.map((tech) => (
                            <Badge
                              key={tech}
                              className="bg-white/80 text-gray-700 border border-gray-200 text-sm px-3 py-1 font-medium"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/projects">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow border-0">
                  View all projects
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Client Feedback section removed for a cleaner home page */}

        {/* Freelancer Advantage Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-brandSecondary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent mb-6 text-center"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Why choose a freelancer?
                </h2>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Discover the advantages of working directly with talent
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white border-2 border-green-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="text-center flex flex-col items-center">
                  <div className="mb-6">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 border-2 border-green-200 mb-2">
                      <PiggyBank className="w-8 h-8 text-green-500" />
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Save 40-60%
                  </h3>
                  <p className="text-gray-700 text-lg">
                    No agency markup or overhead costs. Get premium quality at
                    freelance prices.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white border-2 border-blue-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="text-center flex flex-col items-center">
                  <div className="mb-6">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-200 mb-2">
                      <Zap className="w-8 h-8 text-blue-500" />
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    2x Faster
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Direct communication and streamlined processes mean faster
                    delivery.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white border-2 border-purple-200 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="text-center flex flex-col items-center">
                  <div className="mb-6">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-50 border-2 border-purple-200 mb-2">
                      <Handshake className="w-8 h-8 text-purple-500" />
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Personal Touch
                  </h3>
                  <p className="text-gray-700 text-lg">
                    Your project gets dedicated attention, not split focus
                    across dozens of clients.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="text-center">
              <Link href="/freelancer-advantage">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 md:px-10 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 border-0"
                >
                  Learn why freelancers win
                  <ArrowRightIcon className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-blue-800 to-blue-900 relative overflow-hidden">
          {/* Decorative floating elements removed */}

          <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-5xl md:text-6xl font-black text-white mb-8 text-center"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Ready to get started?
              </h2>
              <p className="text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                Let’s turn your ideas into a production‑ready product.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl border-0"
                  >
                    Contact me
                  </Button>
                </Link>

                <Link href="/services">
                  <Button
                    size="lg"
                    className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-300"
                  >
                    Explore services
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomeScreen;